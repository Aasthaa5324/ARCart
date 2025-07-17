// // import { useEffect, useState } from 'react';
// // import { useRouter } from 'next/router';
// // import { supabase } from '../lib/supabaseClient';
// // import Script from 'next/script';
// // import Head from 'next/head';

// // export default function ARViewerPage() {
// //   const router = useRouter();
// //   const { id } = router.query;
// //   const [modelUrl, setModelUrl] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchModel = async () => {
// //       try {
// //         setLoading(true);
// //         if (!id) return;

// //         const { data, error: sbError } = await supabase
// //           .from('furniture')
// //           .select('model_url')
// //           .eq('model_id', id)
// //           .single();

// //         if (sbError) throw sbError;
// //         if (!data?.model_url) throw new Error('Model not found');

// //         setModelUrl(data.model_url);
// //       } catch (err) {
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchModel();
// //   }, [id]);

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
// //         <h2 className="text-2xl font-bold mb-4 text-red-600">Error loading model</h2>
// //         <p className="text-gray-700 mb-6">{error}</p>
// //         <button
// //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// //           onClick={() => router.push('/')}
// //         >
// //           ← Back to Gallery
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="relative h-screen w-screen">
// //       <Head>
// //         <title>View Model in AR</title>
// //       </Head>

// //       {/* ✅ Load model-viewer library properly */}
// //       <Script
// //         type="module"
// //         src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
// //         strategy="beforeInteractive"
// //       />

// //       {/* Back button */}
// //       <button
// //         onClick={() => router.push('/')}
// //         className="absolute top-4 left-4 z-50 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
// //       >
// //         ← Back
// //       </button>

// //       {/* AR Viewer */}
// //       <model-viewer
// //         src={modelUrl || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'}
// //         ar
// //         auto-rotate
// //         camera-controls
// //         ar-modes="scene-viewer webxr quick-look"
// //         style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}
// //       >
// //         <button
// //           slot="ar-button"
// //           className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
// //         >
// //           View in AR
// //         </button>
// //       </model-viewer>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '../lib/supabaseClient';
// import Script from 'next/script';
// import Head from 'next/head';

// export default function ARViewerPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [modelData, setModelData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showQR, setShowQR] = useState(false);
//   const [qrCodeUrl, setQrCodeUrl] = useState('');
//   const [arSupported, setArSupported] = useState(true);
//   const [showInstructions, setShowInstructions] = useState(true);
//   const [placementComplete, setPlacementComplete] = useState(false);

//   useEffect(() => {
//     const fetchModel = async () => {
//       try {
//         setLoading(true);
//         if (!id) return;

//         const { data, error: sbError } = await supabase
//           .from('furniture')
//           .select('model_url, name, thumbnail_url, price')
//           .eq('model_id', id)
//           .single();

//         if (sbError) throw sbError;
//         if (!data?.model_url) throw new Error('Model not found');

//         setModelData(data);
        
//         // Generate QR code URL for the current AR viewer page
//         const currentUrl = window.location.origin + window.location.pathname + window.location.search;
//         const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
//         setQrCodeUrl(qrApiUrl);

//         // Check AR support
//         if (typeof document !== 'undefined') {
//           const modelViewer = document.querySelector('model-viewer');
//           if (modelViewer && !modelViewer.canActivateAR) {
//             setArSupported(false);
//           }
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchModel();
//   }, [id]);

//   const handleShareQR = async () => {
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: `View ${modelData?.name || 'this furniture'} in AR`,
//           text: 'Check out this furniture in augmented reality!',
//           url: window.location.href
//         });
//       } else if (navigator.clipboard) {
//         await navigator.clipboard.writeText(window.location.href);
//         alert('Link copied to clipboard!');
//       } else {
//         // Fallback for older browsers
//         const input = document.createElement('input');
//         input.value = window.location.href;
//         document.body.appendChild(input);
//         input.select();
//         document.execCommand('copy');
//         document.body.removeChild(input);
//         alert('Link copied to clipboard!');
//       }
//     } catch (err) {
//       console.log('Error sharing:', err);
//     }
//   };
// const formatPrice = (price) => {
//     if (!price) return 'Price not available';
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(price);
//   };

//   const handleModelViewerLoad = () => {
//     const modelViewer = document.querySelector('model-viewer');
//     if (modelViewer) {
//       modelViewer.addEventListener('ar-status', (event) => {
//         setArSupported(event.detail.status === 'session-started');
//       });

//       modelViewer.addEventListener('ar-tracking', (event) => {
//         if (event.detail.status === 'tracking') {
//           setShowInstructions(false);
//         }
//       });

//       modelViewer.addEventListener('click', () => {
//         setPlacementComplete(true);
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-50 to-green-100">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
//         <p className="text-gray-700">Loading 3D model...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen p-4 text-center bg-gradient-to-br from-red-50 to-red-100">
//         <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
//           <h2 className="text-2xl font-bold mb-4 text-red-600">Error loading model</h2>
//           <p className="text-gray-700 mb-6">{error}</p>
//           <div className="flex flex-col space-y-3">
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
//               onClick={() => router.push('/')}
//             >
//               ← Back to Gallery
//             </button>
//             <button
//               className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//               onClick={() => window.location.reload()}
//             >
//               ↻ Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative h-screen w-screen overflow-hidden">
//       <Head>
//         <title>{modelData?.name ? `View ${modelData.name} in AR` : 'AR Viewer'}</title>
//         <meta name="description" content="View this furniture in augmented reality" />
//         <meta property="og:title" content={modelData?.name || 'AR Furniture Viewer'} />
//         <meta property="og:description" content="Experience this furniture in your space using AR" />
//         <meta property="og:image" content={modelData?.thumbnail_url || '/default-thumbnail.png'} />
//       </Head>

//       {/* Load model-viewer library */}
//       <Script
//         type="module"
//         src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
//         strategy="beforeInteractive"
//       />

//       {/* Top Controls */}
//       <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
//         <button
//           onClick={() => router.push('/')}
//           className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all flex items-center space-x-2"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           <span>Back</span>
//         </button>

//         <div className="flex space-x-2">
//           {modelData?.price && (
//             <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg font-semibold">
//               ${modelData.price}
//             </div>
//           )}
//           <button
//             onClick={() => setShowQR(!showQR)}
//             className="bg-green-600 bg-opacity-90 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all flex items-center space-x-2"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4m-4 0h-2m2-4h2m0 0V9a5 5 0 00-10 0v7h4" />
//             </svg>
//             <span>QR Code</span>
//           </button>

//           <button
//             onClick={handleShareQR}
//             className="bg-blue-600 bg-opacity-90 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all flex items-center space-x-2"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
//             </svg>
//             <span>Share</span>
//           </button>
//         </div>
//       </div>

//       {/* QR Code Modal */}
//       {showQR && (
//         <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
//             <div className="text-center">
//               <h3 className="text-xl font-bold text-gray-800 mb-2">Scan to View in AR</h3>
//               <p className="text-gray-600 mb-4 text-sm">
//                 Use your mobile device's camera to scan this QR code and view the furniture in your space
//               </p>
              
//               <div className="bg-gray-50 p-4 rounded-lg mb-4 flex justify-center">
//                 <img
//                   src={qrCodeUrl}
//                   alt="QR Code"
//                   className="w-48 h-48"
//                   style={{ imageRendering: 'crisp-edges' }}
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   onClick={() => setShowQR(false)}
//                   className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   <span>Close</span>
//                 </button>
//                 <button
//                   onClick={handleShareQR}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
//                   </svg>
//                   <span>Share</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* AR Viewer */}
//       <model-viewer
//         src={modelData?.model_url || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'}
//         ar
//         ar-scale="fixed"
//         auto-rotate
//         camera-controls
//         camera-orbit="0deg 75deg 105%"
//         interaction-prompt="none"
//         ar-modes="webxr scene-viewer quick-look"
//         environment-image="neutral"
//         exposure="1"
//         shadow-intensity="1"
//         style={{ width: '100%', height: '100%', backgroundColor: '#f0f9ff' }}
//         onLoad={handleModelViewerLoad}
//       >
//         {/* AR Button */}
//         <button
//           slot="ar-button"
//           className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 ${
//             arSupported ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 cursor-not-allowed'
//           } text-white px-8 py-4 rounded-full shadow-lg z-50 flex items-center space-x-2 font-semibold transition-colors`}
//           disabled={!arSupported}
//         >
//           {arSupported ? (
//             <>
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
//               </svg>
//               <span>View in AR</span>
//             </>
//           ) : (
//             <span>AR Not Supported</span>
//           )}
//         </button>

//         {/* Loading Progress Bar */}
//         <div slot="progress-bar" className="ar-progress-bar">
//           <div className="ar-progress-bar-fill"></div>
//         </div>
//       </model-viewer>

//       {/* Product Info Overlay */}
//       {modelData?.name && (
//         <div className="absolute top-20 left-4 z-40">
//           <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 max-w-xs shadow-lg">
//             <h2 className="text-xl font-bold text-gray-800">{modelData.name}</h2>
//             {modelData.price && (
//               <p className="text-lg font-semibold text-green-600 mt-1">${modelData.price}</p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Instructions for mobile users */}
//       {showInstructions && (
//         <div className="absolute bottom-20 left-4 right-4 z-40">
//           <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto shadow-lg">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h4 className="font-semibold text-gray-800 mb-2">📱 How to View in AR:</h4>
//                 <ol className="text-sm text-gray-600 space-y-1">
//                   <li>1. Tap "View in AR" button</li>
//                   <li>2. Allow camera permissions</li>
//                   <li>3. Point camera at flat surface</li>
//                   <li>4. Tap to place furniture</li>
//                 </ol>
//               </div>
//               <button 
//                 onClick={() => setShowInstructions(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Placement Complete Message */}
//       {placementComplete && (
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
//           <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
//             <p className="flex items-center space-x-2">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//               <span>Furniture placed successfully!</span>
//             </p>
//           </div>
//         </div>
//       )}

//       {/* AR Not Supported Message */}
//       {!arSupported && (
//         <div className="absolute bottom-24 left-4 right-4 z-40">
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//               <span>AR not supported on this device. Try on a mobile device.</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Script from 'next/script';
import Head from 'next/head';

export default function ARViewerPage() {
  const router = useRouter();
  const { id } = router.query;
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [arSupported, setArSupported] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [placementComplete, setPlacementComplete] = useState(false);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const { data, error: sbError } = await supabase
          .from('furniture')
          .select('model_url, name, thumbnail_url, furniture_price, description, seller_name, seller_address')
          .eq('model_id', id)
          .single();

        if (sbError) throw sbError;
        if (!data?.model_url) throw new Error('Model not found');

        setModelData(data);

      const currentUrl = `http://10.5.51.120:3000${window.location.pathname}${window.location.search}`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
        setQrCodeUrl(qrApiUrl);

        if (typeof document !== 'undefined') {
          const modelViewer = document.querySelector('model-viewer');
          if (modelViewer && !modelViewer.canActivateAR) {
            setArSupported(false);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id]);

  const handleShareQR = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `View ${modelData?.name || 'this furniture'} in AR`,
          text: 'Check out this furniture in augmented reality!',
          url: window.location.href
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } else {
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleModelViewerLoad = () => {
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
      modelViewer.addEventListener('ar-status', (event) => {
        setArSupported(event.detail.status === 'session-started');
      });

      modelViewer.addEventListener('ar-tracking', (event) => {
        if (event.detail.status === 'tracking') {
          setShowInstructions(false);
        }
      });

      modelViewer.addEventListener('click', () => {
        setPlacementComplete(true);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-700">Loading 3D model...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error loading model</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex flex-col space-y-3">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              onClick={() => router.push('/')}
            >
              ← Back to Gallery
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              onClick={() => window.location.reload()}
            >
              ↻ Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Head>
        <title>{modelData?.name ? `View ${modelData.name} in AR` : 'AR Viewer'}</title>
        <meta name="description" content="View this furniture in augmented reality" />
        <meta property="og:title" content={modelData?.name || 'AR Furniture Viewer'} />
        <meta property="og:description" content="Experience this furniture in your space using AR" />
        <meta property="og:image" content={modelData?.thumbnail_url || '/default-thumbnail.png'} />
      </Head>

      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        strategy="beforeInteractive"
      />

      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        <button
          onClick={() => router.push('/')}
          className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>

        <div className="flex space-x-2">
          {modelData?.furniture_price && (
            <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg font-semibold">
              {formatPrice(modelData.furniture_price)}
            </div>
          )}
          <button
            onClick={() => setShowQR(!showQR)}
            className="bg-green-600 bg-opacity-90 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4m-4 0h-2m2-4h2m0 0V9a5 5 0 00-10 0v7h4" />
            </svg>
            <span>QR Code</span>
          </button>

          <button
            onClick={handleShareQR}
            className="bg-blue-600 bg-opacity-90 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>

      {showQR && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Scan to View in AR</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Use your mobile device's camera to scan this QR code and view the furniture in your space
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 flex justify-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowQR(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Close</span>
                </button>
                <button
                  onClick={handleShareQR}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <model-viewer
        src={modelData?.model_url || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'}
        ar
        ar-scale="fixed"
        auto-rotate
        camera-controls
        camera-orbit="0deg 75deg 105%"
        interaction-prompt="none"
        ar-modes="webxr scene-viewer quick-look"
        environment-image="neutral"
        exposure="1"
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', backgroundColor: '#f0f9ff' }}
        onLoad={handleModelViewerLoad}
      >
        <div slot="progress-bar" className="ar-progress-bar">
          <div className="ar-progress-bar-fill"></div>
        </div>
      </model-viewer>

      {/* Product Info Overlay */}
      {modelData && (
        <div className="absolute top-20 left-4 z-40">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 max-w-xs shadow-lg">
            <h2 className="text-xl font-bold text-gray-800">{modelData.name}</h2>
            <p className="text-lg font-semibold text-green-600 mt-1">{formatPrice(modelData.furniture_price)}</p>
            <p className="text-gray-700 mt-1"><span className="font-semibold">Description:</span> {modelData.description}</p>
            <p className="text-gray-700 mt-1"><span className="font-semibold">Seller:</span> {modelData.seller_name}</p>
            <p className="text-gray-700 mt-1"><span className="font-semibold">Location:</span> {modelData.seller_address}</p>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="absolute bottom-20 left-4 right-4 z-40">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📱 How to View in AR:</h4>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Tap "View in AR" button</li>
                  <li>2. Allow camera permissions</li>
                  <li>3. Point camera at flat surface</li>
                  <li>4. Tap to place furniture</li>
                </ol>
              </div>
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {placementComplete && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
            <p className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Furniture placed successfully!</span>
            </p>
          </div>
        </div>
      )}

      {!arSupported && (
        <div className="absolute bottom-24 left-4 right-4 z-40">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>AR not supported on this device. Try on a mobile device.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}