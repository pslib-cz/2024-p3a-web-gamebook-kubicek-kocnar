// src/App.js
import React from 'react';
import * as THREE from 'three';
import type BlockType from '../../types/Block';
import { useThree } from '@react-three/fiber';

type BlockProps = {
  block: BlockType
  onClick: (blockId: number, faceIndex: number, distance: number) => void | undefined, // Callback for when the Block is clicked
};

const Block = ({block, onClick} : BlockProps) => {
  const { gl, camera } = useThree();
  // Animation state
  const meshRef = React.useRef<THREE.Mesh>(null);

  const textureLoader = new THREE.TextureLoader();
  const textures = [
    textureLoader.load('https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp'),
    textureLoader.load('https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp'),
    textureLoader.load('https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp'),
    textureLoader.load('https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp'),
    textureLoader.load('https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp'),
    textureLoader.load('https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp'),
  ];

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (onClick && meshRef.current) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(meshRef.current);
        // console.log(intersects);
        if (intersects.length > 0) {
          const faceIndex = intersects[0].face?.materialIndex;
          if (faceIndex !== undefined) {
            const distance = intersects[0].distance;
            onClick(block.blockId, faceIndex, distance);
          }
        }
      }
    };

    const mesh = meshRef.current;

    if (mesh) {
      gl.domElement.addEventListener('pointerdown', handlePointerDown);
    }

    return () => {
      if (mesh) {
        gl.domElement.removeEventListener('pointerdown', handlePointerDown);
      }
    };
  }, [onClick, gl, camera, block]);

  return (
    <mesh 
      ref={meshRef} 
      position={block.position}
      name='Obstacle'
      >
      <boxGeometry args={[1, 1, 1]} />
      {textures.map((texture, index) => (
        <meshStandardMaterial
          key={index} 
          attach={`material-${index}`} map={texture}
        />
      ))}
    </mesh>
  );
};

export default Block;