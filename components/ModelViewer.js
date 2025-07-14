// 'use client'
// import { Suspense, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
// import * as THREE from 'three';
// import { useGLTF } from '@react-three/drei';

// useGLTF.preload(modelUrl); // optional, but improves UX


// function Model({ url }) {
//   const { scene } = useGLTF(url);
  
//   // Center and scale model
//   const box = new THREE.Box3().setFromObject(scene);
//   const center = box.getCenter(new THREE.Vector3());
//   const size = box.getSize(new THREE.Vector3()).length();
  
//   scene.position.set(-center.x, -center.y, -center.z);
//   scene.scale.setScalar(2.5 / size);

//   return <primitive object={scene} />;
// }

// export default function ModelViewer({ modelUrl }) {
//   const [loading, setLoading] = useState(true);

//   return (
//     <div className="relative h-full w-full">
//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       )}
      
//       <Canvas
//         style={{ background: '#000000', opacity: loading ? 0 : 1 }}
//         onCreated={() => setLoading(false)}
//       >
//         <ambientLight intensity={1.2} />
//         <directionalLight
//           position={[5, 10, 7]}
//           intensity={2.5}
//           castShadow
//           shadow-mapSize-width={2048}
//           shadow-mapSize-height={2048}
//         />
//         <pointLight position={[-5, 5, -5]} intensity={1.8} />
        
//         <Environment preset="city" background={false} />
        
//         <Suspense fallback={null}>
//           <Model url={modelUrl} />
//         </Suspense>
        
//         <OrbitControls 
//           minDistance={1}
//           maxDistance={50}
//           enablePan={true}
//         />
//       </Canvas>
//     </div>
//   );
// }

'use client'
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }) {
  const { scene } = useGLTF(url);

  // Debug bounding box
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();

  console.log('📐 Model size:', size);

  // Center + scale
  scene.position.set(-center.x, -center.y, -center.z);
  scene.scale.setScalar(2.5 / size);

  // Material fix
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.DoubleSide;
      child.material.transparent = false;
    }
  });

  return <primitive object={scene} />;
}

export default function ModelViewer({ modelUrl }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        onCreated={() => setLoading(false)}
        camera={{ position: [2, 2, 2], fov: 45 }}
        style={{ width: '100vw', height: '100vh', background: '#111' }}
      >
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 7]} intensity={2.5} />
        <pointLight position={[-5, 5, -5]} intensity={1.5} />

        {/* Background lighting */}
        <Environment preset="sunset" background />

        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}
