// 'use client';

// import React, { useEffect } from 'react';
// import { Canvas, useThree } from '@react-three/fiber';
// import FBOParticles from './FBOParticles';
// import { PerspectiveCamera } from 'three';

// const CameraController = () => {
//   const { camera, gl } = useThree();
  
//   useEffect(() => {
//     const handleResize = () => {
//       if (camera instanceof PerspectiveCamera) {
//         camera.aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;
//         camera.updateProjectionMatrix();
//       }
//       gl.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [camera, gl]);

//   return null;
// };


// const Scene: React.FC = () => {
//   return (
//     <Canvas camera={{ position: [1.5, 1.5, 1.5] }} className="h-full w-full" shadows={true} gl={{ antialias: true }}>
//       <CameraController />
//       <ambientLight intensity={0.3} />
//       <FBOParticles />
//     </Canvas>
//   );
// };

// export default React.memo(Scene);


'use client';

import React, { useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import FBOParticles from './FBOParticles';

// Camera controller handles resize events and basic camera setup
const CameraController = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;
        camera.updateProjectionMatrix();
      }
      gl.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight);
    };
    
    // Initial sizing
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, gl]);

  // Slow camera rotation for visual effect
  useFrame(({ clock }) => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const t = clock.getElapsedTime() * 0.1;
      camera.position.x = Math.sin(t) * 2;
      camera.position.z = Math.cos(t) * 2;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

// Main Scene component
const Scene: React.FC = () => {
  return (
    <Canvas 
      gl={{ 
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      }}
      camera={{ 
        position: [1.5, 1.5, 1.5], 
        fov: 75, 
        near: 0.1, 
        far: 1000 
      }}
      className="h-full w-full"
    >
      {/* Controllers */}
      <CameraController />
      {/* <OrbitControls enableRotate enableZoom enablePan /> */}
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      {/* Particle system */}
      <FBOParticles />
    </Canvas>
  );
};

export default React.memo(Scene);
