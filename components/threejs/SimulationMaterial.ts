import * as THREE from 'three';
import { simulationVertexShader, simulationFragmentShader } from './index';

const getRandomData = (width: number, height: number) => {
  const length = width * height * 4;
  const data = new Float32Array(length);

  for (let i = 0; i < length / 4; i++) {
    const stride = i * 4;

    const distance = Math.sqrt(Math.random()) * 3.0;
    const theta = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);

    data[stride] = distance * Math.sin(theta) * Math.cos(phi);
    data[stride + 1] = distance * Math.sin(theta) * Math.sin(phi);
    data[stride + 2] = distance * Math.cos(theta);
    data[stride + 3] = 1.0;
  }

  return data;
};

export class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(size: number) {
    // Create initial positions texture
    const positionsTexture = new THREE.DataTexture(
      getRandomData(size, size),
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    positionsTexture.needsUpdate = true;

    super({
      uniforms: {
        positions: { value: positionsTexture },
        uFrequency: { value: 0.25 },
        uTime: { value: 0 },
        uTarget: { value: new THREE.Vector3(0, 0, 0) }
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });
  }
}

export default SimulationMaterial;
