// components/ARViewerPage.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function ARViewerPage() {
  const router = useRouter();
  const { id } = router.query;
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchModel = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('furniture')
          .select('model_url')
          .eq('model_id', id)
          .single();

        if (supabaseError) throw supabaseError;
        if (!data?.model_url) throw new Error('Model not found');

        setModelUrl(data.model_url);
      } catch (err) {
        console.error('Failed to load model:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
        <p>Loading model...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading model</h2>
        <p>{error}</p>
        <button className="back-button" onClick={() => router.push('/')}>
          ← Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="ar-container">
      <button
        className="back-button"
        onClick={() => router.push('/')}
      >
        ← Back
      </button>

      {modelUrl && (
        <model-viewer
          src={modelUrl}
          ar
          camera-controls
          style={{ width: '100vw', height: '100vh' }}
        >
          <button slot="ar-button">View in AR</button>
        </model-viewer>
      )}
    </div>
  );
}