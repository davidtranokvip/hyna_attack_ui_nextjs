// 'use client';

// import React, { useMemo, useRef } from 'react';
// import * as THREE from 'three';
// import { useFBO } from "@react-three/drei";
// import { extend, useFrame, createPortal } from '@react-three/fiber';
// import { fragmentShader, vertexShader } from './index';
// import { SimulationMaterial } from './SimulationMaterial';

// extend({ SimulationMaterial });

// const FBOParticles: React.FC = () => {
//   const size = 96;
//   const pointsRef = useRef<THREE.Points>(null);
//   const simulationMaterialRef = useRef<SimulationMaterial | null>(null);

//   const scene = new THREE.Scene();
//   const camera = new THREE.OrthographicCamera(
//     -1,
//     1,
//     1,
//     -1,
//     1 / Math.pow(2, 53),
//     1
//   );

//   const positions = new Float32Array([
//     -1, -1, 0,
//      1, -1, 0,
//      1,  1, 0,
//     -1, -1, 0,
//      1,  1, 0,
//     -1,  1, 0,
//   ]);
//   const uvs = new Float32Array([
//     0, 1,
//     1, 1,
//     1, 0,
//     0, 1,
//     1, 0,
//     0, 0,
//   ]);

//   // Create FBO
//   const renderTarget = useFBO(size, size, {
//     minFilter: THREE.NearestFilter,
//     magFilter: THREE.NearestFilter,
//     format: THREE.RGBAFormat,
//     stencilBuffer: false,
//     type: THREE.FloatType,
//   });

//   // Positions for the final particles
//   const particlesPosition = useMemo(() => {
//     const length = size * size;
//     const particles = new Float32Array(length * 3);
//     for (let i = 0; i < length; i++) {
//       const i3 = i * 3;
//       particles[i3 + 0] = (i % size) / size; // u
//       particles[i3 + 1] = i / size / size;   // v
//       particles[i3 + 2] = 0;
//     }
//     return particles;
//   }, [size]);

//   // Setup uniforms for the display shader
//   const uniforms = useMemo(() => ({
//     uPositions: { value: null },
//     uAttractionStrength: { value: 0.005 },
//     uCenter: { value: new THREE.Vector2(0.5, 0.5) },
//   }), []);

//   useFrame((state) => {
//     const { gl, clock } = state;

//     gl.setRenderTarget(renderTarget);
//     gl.clear();
//     gl.render(scene, camera);
//     gl.setRenderTarget(null);
//     if (pointsRef.current) {
//       (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uPositions.value =
//         renderTarget.texture;
//     }

//     if (simulationMaterialRef.current) {
//       simulationMaterialRef.current.uniforms.uTarget.value = new THREE.Vector3(0.5, 0.5, 0.0);
//       simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
//     }
//   });

//   return (
//     <>
//       {createPortal(
//         <mesh>
//            <primitive 
//               object={new SimulationMaterial(size)} 
//               ref={simulationMaterialRef} 
//               attach="material" 
//             />
//           {/* <simulationMaterial ref={simulationMaterialRef} args={[size]} /> */}
//           <bufferGeometry>
//           <bufferAttribute
//             attach="attributes-position"
//             count={positions.length / 3}
//             array={positions}
//             itemSize={3}
//             args={[positions, 3]}  // Add this line with the required constructor arguments
//           />
//             {/* <bufferAttribute
//               attach="attributes-uv"
//               count={uvs.length / 2}
//               array={uvs}
//               itemSize={2}
//             /> */}
//             <bufferAttribute
//               attach="attributes-uv"
//               count={uvs.length / 2}
//               array={uvs}
//               itemSize={2}
//               args={[uvs, 2]}  // Added args property for constructor arguments
//             />
//           </bufferGeometry>
//         </mesh>,
//         scene
//       )}
//       <points ref={pointsRef}>
//         <sphereGeometry args={[1, 56, 56]} />
//         <bufferGeometry>
//           {/* <bufferAttribute
//             attach="attributes-position"
//             count={particlesPosition.length / 3}
//             array={particlesPosition}
//             itemSize={3}
//           /> */}
//           <bufferAttribute
//             attach="attributes-position"
//             count={particlesPosition.length / 3}
//             array={particlesPosition}
//             itemSize={3}
//             args={[particlesPosition, 3]}  // Added args property for constructor arguments
//           />
//         </bufferGeometry>
//         <shaderMaterial
//           blending={THREE.AdditiveBlending}
//           depthWrite={false}
//           fragmentShader={fragmentShader}
//           vertexShader={vertexShader}
//           uniforms={uniforms}
//         />
//       </points>
//     </>
//   );
// };

// export default FBOParticles;


'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFBO } from "@react-three/drei";
import { extend, useFrame, createPortal } from '@react-three/fiber';
import { SimulationMaterial, vertexShader, fragmentShader } from './SimulationMaterial';

// Register the simulation material as a custom component
extend({ SimulationMaterial });

const FBOParticles: React.FC = () => {
  const size = 56;
  const pointsRef = useRef<THREE.Points>(null);
  const simulationMaterialRef = useRef<SimulationMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a separate scene for simulation
  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => 
    new THREE.OrthographicCamera(
      -1, 1, 1, -1, 
      1 / Math.pow(2, 53), 1
    ), []);

  // Create the geometry for the simulation plane
  const simGeometry = useMemo(() => {
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
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    
    return geometry;
  }, []);

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

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position', 
      new THREE.BufferAttribute(particlesPosition, 3)
    );
    return geometry;
  }, [particlesPosition]);

  // Setup uniforms for the display shader
  const uniforms = useMemo(() => ({
    uPositions: { value: null },
    uTime: { value: 0 },
    uRadius: { value: 1.0 }
  }), []);

  // Initialize material
  useEffect(() => {
    if (simulationMaterialRef.current) {
      // Set initial uniforms if needed
      simulationMaterialRef.current.uniforms.uFrequency.value = 0.25;
    }
  }, []);

  useFrame((state) => {
    const { gl, clock } = state;

    // Update simulation
    if (simulationMaterialRef.current) {
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
      simulationMaterialRef.current.uniforms.uTarget.value = new THREE.Vector3(
        Math.sin(clock.elapsedTime * 0.1) * 0.5,
        Math.cos(clock.elapsedTime * 0.1) * 0.5,
        0.0
      );
    }

    // Render to FBO
    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Update particle positions from FBO
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uPositions.value = renderTarget.texture;
      material.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <>
      {/* Simulation mesh - rendered to FBO */}
      {createPortal(
        <mesh ref={meshRef} geometry={simGeometry}>
          {/* <simulationMaterial ref={simulationMaterialRef} args={[size]} /> */}
        </mesh>,
        scene
      )}
      
      {/* Visible particles using the FBO positions */}
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry attach="geometry" {...particlesGeometry} />
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