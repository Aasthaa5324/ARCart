import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Script from 'next/script';
import Head from 'next/head';

export default function ARViewerPage() {
  const router = useRouter();
  const { id } = router.query;
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const { data, error: sbError } = await supabase
          .from('furniture')
          .select('model_url')
          .eq('model_id', id)
          .single();

        if (sbError) throw sbError;
        if (!data?.model_url) throw new Error('Model not found');

        setModelUrl(data.model_url);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error loading model</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => router.push('/')}
        >
          ← Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      <Head>
        <title>View Model in AR</title>
      </Head>

      {/* ✅ Load model-viewer library properly */}
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        strategy="beforeInteractive"
      />

      {/* Back button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 z-50 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
      >
        ← Back
      </button>

      {/* AR Viewer */}
      <model-viewer
        src={modelUrl || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'}
        ar
        auto-rotate
        camera-controls
        ar-modes="scene-viewer webxr quick-look"
        style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
        >
          View in AR
        </button>
      </model-viewer>
    </div>
  );
}
