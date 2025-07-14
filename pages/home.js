// // File: pages/index.js
// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { supabase } from '../lib/supabaseClient';

// export default function Home() {
//   const [models, setModels] = useState([]);

//   useEffect(() => {
//     const fetchModels = async () => {
//       const { data, error } = await supabase.from('furniture').select('*');
//       console.log('Models fetched:', data);
//       if (error) console.error('Error loading furniture:', error);
//       else setModels(data);
//     };
//     fetchModels();
//   }, []);

//   return (
//     <main className="min-h-screen bg-white p-6">
//       <h1 className="text-3xl font-bold mb-8">Furniture Collection</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {models.map((model) => (
//           <Link
//             key={model.id}
//             href={`/view?id=${model.model_id}`}
//             className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative group"
//             prefetch={false}
//           >
//             {/* Using your gallery-image-container class */}
//             <div className="gallery-image-container bg-gray-100">
//               <Image
//                 src={model.thumbnail_url || '/default-thumbnail.png'}
//                 alt={model.name || 'Furniture item'}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, 33vw"
//                 priority={models.indexOf(model) < 3}
//                 quality={80}
//               />
//               {/* Debug overlay - remove in production */}
//               <div className="absolute bottom-0 left-0 bg-black text-white p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
//                 {model.name}
//               </div>
//             </div>
//             <div className="p-4">
//               <h3 className="font-medium text-lg">{model.name}</h3>
//               <p className="text-blue-600 mt-2">View in AR →</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </main>
//   );
// }