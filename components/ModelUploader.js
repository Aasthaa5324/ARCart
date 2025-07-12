// ModelUploader.js
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function ModelUploader({ sellerId, onUpload }) {
  const [name, setName] = useState('');
  const [files, setFiles] = useState({
    thumbnail: null,
    model: null
  });
  const [progress, setProgress] = useState(0);

  const getPublicUrl = (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleUpload = async () => {
    const modelId = uuidv4();
    
    // 1. Upload files to storage
    const uploads = [
      supabase.storage
        .from('thumbnails')
        .upload(`${modelId}.jpg`, files.thumbnail),
      supabase.storage
        .from('models')
        .upload(`${modelId}.glb`, files.model)
    ];

    // Progress tracking
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90));
    }, 300);

    try {
      await Promise.all(uploads);
      clearInterval(interval);

      // 2. Insert into furniture table
      const { data: furniture, error } = await supabase
        .from('furniture')
        .insert({
          name,
          model_id: modelId,
          thumbnail_url: getPublicUrl('thumbnails', `${modelId}.jpg`),
          model_url: getPublicUrl('models', `${modelId}.glb`)
        })
        .select()
        .single();

      if (error) throw error;

      // 3. Create seller_furniture relationship
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
      // Clean up failed uploads
      await supabase.storage.from('thumbnails').remove([`${modelId}.jpg`]);
      await supabase.storage.from('models').remove([`${modelId}.glb`]);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="uploader-form">
      <input 
        type="text" 
        placeholder="Furniture Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-input"
      />
      
      <label className="file-upload-label">
        Thumbnail Image (JPEG/PNG)
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setFiles({...files, thumbnail: e.target.files[0]})}
          className="file-input"
        />
      </label>
      
      <label className="file-upload-label">
        3D Model (.GLB)
        <input 
          type="file" 
          accept=".glb"
          onChange={(e) => setFiles({...files, model: e.target.files[0]})}
          className="file-input"
        />
      </label>
      
      {progress > 0 && (
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }}></div>
        </div>
      )}
      
      <button 
        onClick={handleUpload}
        disabled={!name || !files.thumbnail || !files.model}
        className="upload-button"
      >
        {progress > 0 ? `Uploading... ${progress}%` : 'Upload Model'}
      </button>
    </div>
  );
}