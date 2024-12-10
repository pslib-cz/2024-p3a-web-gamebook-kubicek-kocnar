/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useRef, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader, GLTF } from '../../loaders/GLTFLoader.js';
import { Euler, Vector3 } from 'three';

interface ModelProps {
  path: string;
  position: Vector3;
  rotation?: Euler;
  name?: string;
}

const Model: React.FC<ModelProps> = ({ path, position, rotation = new Euler(0, 0, 0), name="NewModel" }) => {
  const gltf = useLoader<GLTF>(GLTFLoader, path);
  const modelRef = useRef<THREE.Group>(null);

  const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  console.log(`Loaded model from ${path}`, gltf);

  return (
  <group position={position} rotation={rotation} name={name}>
      <primitive
          ref={modelRef}
          object={clonedScene}
          dispose={null}
      />
  </group>
  );
};

export default Model;