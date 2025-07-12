//pages/upload.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function UploadFurniture() {
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [modelFile, setModelFile] = useState(null);

  const handleUpload = async () => {
    if (!name || !thumbnail || !modelFile) return alert('Fill all fields!');

    const id = uuidv4();

    // Upload thumbnail
    const thumbRes = await supabase.storage
      .from('thumbnails')
      .upload(`${id}.png`, thumbnail);

    // Upload model
    const modelRes = await supabase.storage
      .from('models')
      .upload(`${id}.glb`, modelFile);

    if (thumbRes.error || modelRes.error) {
      console.error(thumbRes.error || modelRes.error);
      return;
    }

    let thumbUrl = supabase
  .storage
  .from('thumbnails')
  .getPublicUrl(`${id}.png`).data.publicUrl;

if (thumbUrl.startsWith('//')) {
  thumbUrl = 'https:' + thumbUrl;
}


let modelUrl = supabase
  .storage
  .from('models')
  .getPublicUrl(`${id}.glb`).data.publicUrl;

if (modelUrl.startsWith('//')) {
  modelUrl = 'https:' + modelUrl;
}


    // Insert into DB
    const { error } = await supabase.from('furniture').insert({
      name,
      model_id: id,
      model_path: modelUrl,
      thumbnail_url: thumbUrl
    });

    if (error) console.error('DB Insert Error:', error);
    else alert('Furniture uploaded!');
  };

  return (
    <div>
      <h1>Upload Furniture</h1>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="file" accept="image/png" onChange={(e) => setThumbnail(e.target.files[0])} />
      <input type="file" accept=".glb" onChange={(e) => setModelFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
