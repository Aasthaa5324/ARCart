'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

function Model({ url }) {
  const { scene } = useGLTF(url, true) // Keep original colors
  
  useEffect(() => {
    // Auto-center and scale model
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3()).length()
    
    scene.position.set(-center.x, -center.y, -center.z)
    scene.scale.setScalar(2.5 / size) // Perfect fit
  }, [scene])

  return <primitive object={scene} />
}

export default function ModelViewer({ modelUrl }) {
  return (
    <Canvas style={{ background: '#000000' }}>
      {/* Your Original Lighting */}
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight
        position={[5, 10, 7]}
        intensity={2.5}
        color="#fff9e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight 
        position={[-5, 5, -5]} 
        intensity={1.8}
        color="#e0f7ff"
      />

      <Environment preset="city" background={false} />

      <Model url={modelUrl} />
      <OrbitControls 
        minDistance={1}       // Closer zoom allowed
        maxDistance={50}      // Increased from 15
        enablePan={true}
      />
    </Canvas>
  )
}