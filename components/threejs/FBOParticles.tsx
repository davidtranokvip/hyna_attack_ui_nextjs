'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFBO } from "@react-three/drei";
import { extend, useFrame, createPortal } from '@react-three/fiber';
import { fragmentShader, vertexShader } from './index';
import { SimulationMaterial } from './SimulationMaterial';

extend({ SimulationMaterial });

const FBOParticles: React.FC = () => {
  const size = 96;
  const pointsRef = useRef<THREE.Points>(null);
  const simulationMaterialRef = useRef<SimulationMaterial | null>(null);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1
  );

  const positions = new Float32Array([
    -1, -1, 0,
     1, -1, 0,
     1,  1, 0,
    -1, -1, 0,
     1,  1, 0,
    -1,  1, 0,
  ]);
  const uvs = new Float32Array([
    0, 1,
    1, 1,
    1, 0,
    0, 1,
    1, 0,
    0, 0,
  ]);

  // Create FBO
  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  // Positions for the final particles
  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size; // u
      particles[i3 + 1] = i / size / size;   // v
      particles[i3 + 2] = 0;
    }
    return particles;
  }, [size]);

  // Setup uniforms for the display shader
  const uniforms = useMemo(() => ({
    uPositions: { value: null },
    uAttractionStrength: { value: 0.005 },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
  }), []);

  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    if (pointsRef.current) {
      (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uPositions.value =
        renderTarget.texture;
    }

    if (simulationMaterialRef.current) {
      simulationMaterialRef.current.uniforms.uTarget.value = new THREE.Vector3(0.5, 0.5, 0.0);
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <>
      {createPortal(
        <mesh>
           <primitive 
              object={new SimulationMaterial(size)} 
              ref={simulationMaterialRef} 
              attach="material" 
            />
          {/* <simulationMaterial ref={simulationMaterialRef} args={[size]} /> */}
          <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
            args={[positions, 3]}  // Add this line with the required constructor arguments
          />
            {/* <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            /> */}
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
              args={[uvs, 2]}  // Added args property for constructor arguments
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={pointsRef}>
        <sphereGeometry args={[1, 56, 56]} />
        <bufferGeometry>
          {/* <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          /> */}
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
            args={[particlesPosition, 3]}  // Added args property for constructor arguments
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};

export default FBOParticles;
