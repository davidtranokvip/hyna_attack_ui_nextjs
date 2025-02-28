'use client';

import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import FBOParticles from './FBOParticles';
import { PerspectiveCamera } from 'three';

const CameraController = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    const handleResize = () => {
      if (camera instanceof PerspectiveCamera) {
        camera.aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;
        camera.updateProjectionMatrix();
      }
      gl.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, gl]);

  return null;
};


const Scene: React.FC = () => {
  return (
    <Canvas camera={{ position: [1.5, 1.5, 1.5] }} className="h-full w-full" shadows={true}>
      <CameraController />
      <ambientLight intensity={0.3} />
      <FBOParticles />
    </Canvas>
  );
};

export default Scene;
