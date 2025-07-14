import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabaseClient';

export default function ModelUploader({ sellerId, onUpload }) {
  const [name, setName] = useState('');
  const [files, setFiles] = useState({
    thumbnail: null,
    model: null
  });
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!name || !files.thumbnail || !files.model) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);
    
    const modelId = uuidv4();
    const uploadPromises = [];
    const filesToRemove = [];

    try {
      // Upload thumbnail
      if (files.thumbnail) {
        uploadPromises.push(
          supabase.storage
            .from('thumbnails')
            .upload(`${modelId}.${files.thumbnail.name.split('.').pop()}`, files.thumbnail, {
              cacheControl: '3600',
              upsert: false
            })
        );
        filesToRemove.push(`thumbnails/${modelId}.${files.thumbnail.name.split('.').pop()}`);
      }

      // Upload model
      if (files.model) {
        uploadPromises.push(
          supabase.storage
            .from('models')
            .upload(`${modelId}.${files.model.name.split('.').pop()}`, files.model)
        );
        filesToRemove.push(`models/${modelId}.${files.model.name.split('.').pop()}`);
      }

      // Track upload progress
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + 5, 90));
      }, 500);

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      
      // Check for upload errors
      const uploadErrors = uploadResults.filter(result => result.error);
      if (uploadErrors.length > 0) {
        throw uploadErrors[0].error;
      }

      clearInterval(interval);
      setProgress(95);

      // Create furniture record
      const { data: furniture, error: insertError } = await supabase
        .from('furniture')
        .insert({
          name,
          model_id: modelId,
          thumbnail_url: supabase.storage
            .from('thumbnails')
            .getPublicUrl(`${modelId}.${files.thumbnail.name.split('.').pop()}`).data.publicUrl,
          model_url: supabase.storage
            .from('models')
            .getPublicUrl(`${modelId}.${files.model.name.split('.').pop()}`).data.publicUrl
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Create seller relationship
      await supabase
        .from('seller_furniture')
        .insert({
          seller_id: sellerId,
          furniture_id: furniture.id
        });

      setProgress(100);
      onUpload();
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message);
      
      // Clean up uploaded files
      if (filesToRemove.length > 0) {
        await supabase.storage.from(filesToRemove[0].split('/')[0]).remove([filesToRemove[0].split('/')[1]]);
        if (filesToRemove.length > 1) {
          await supabase.storage.from(filesToRemove[1].split('/')[0]).remove([filesToRemove[1].split('/')[1]]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Furniture Name
        </label>
        <input
          type="text"
          placeholder="e.g., Modern Chair"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thumbnail Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFiles({...files, thumbnail: e.target.files[0]})}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          3D Model (GLB format)
        </label>
        <input
          type="file"
          accept=".glb"
          onChange={(e) => setFiles({...files, model: e.target.files[0]})}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={loading || !name || !files.thumbnail || !files.model}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? `Uploading... ${progress}%` : 'Upload Model'}
      </button>
    </div>
  );
}