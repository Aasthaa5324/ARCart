import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [name, setName] = useState('');
  const [modelFile, setModelFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name || !modelFile || !thumbnail) {
      alert('Please provide name, model file (.glb), and thumbnail image.');
      return;
    }

    try {
      setUploading(true);
      const id = uuidv4();
      const modelExt = modelFile.name.split('.').pop();
      const thumbExt = thumbnail.name.split('.').pop();

      const modelPath = `${id}.${modelExt}`;
      const thumbPath = `${id}.${thumbExt}`;

      // Upload thumbnail to 'thumbnail' bucket
      const { error: thumbErr } = await supabase.storage
        .from('thumbnail') // ✅ singular bucket name
        .upload(thumbPath, thumbnail);

      if (thumbErr) throw thumbErr;

      // Upload model to 'models' bucket
      const { error: modelErr } = await supabase.storage
        .from('models')
        .upload(modelPath, modelFile, {
          contentType: 'model/gltf-binary',
        });

      if (modelErr) throw modelErr;

      // Public URLs
      const thumbnail_url = supabase.storage
        .from('thumbnail')
        .getPublicUrl(thumbPath).data.publicUrl;

      const model_url = supabase.storage
        .from('models')
        .getPublicUrl(modelPath).data.publicUrl;

      // Insert into 'furniture' table
      const { error: dbErr } = await supabase
        .from('furniture')
        .insert({
          name,
          model_id: id,
          model_url,
          thumbnail_url,
        });

      if (dbErr) throw dbErr;

      alert('Upload successful ✅');
      setName('');
      setModelFile(null);
      setThumbnail(null);
      router.push('/');
    } catch (err) {
      console.error('Upload error:', err.message);
      alert('Upload failed ❌: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard – Upload Furniture</h1>
      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <input
          type="text"
          placeholder="Furniture name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <label className="block text-sm font-medium text-gray-700">Thumbnail Image (.jpg/.png)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="w-full p-2 border rounded"
          required
        />

        <label className="block text-sm font-medium text-gray-700">3D Model File (.glb)</label>
        <input
          type="file"
          accept=".glb"
          onChange={(e) => setModelFile(e.target.files[0])}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
