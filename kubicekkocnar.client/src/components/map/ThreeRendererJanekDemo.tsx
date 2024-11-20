// src/App.js
import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { OrbitControls } from '@react-three/drei';

const RotatingCube = ({sdsd, id, setsds} : {sdsd : [3], id: number, setsds : any}) => {
  // Animation state
  const meshRef = React.useRef();
  const { gl, camera } = useThree();

  React.useEffect(() => {
    const handleMouseDown = (event) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0) {
        const faceIndex = intersects[0].faceIndex;
        console.log(`Mouse button down on cube ${id}, face ${faceIndex}`);

        // @ts-ignore i am lazy
        setsds((prev: [number, number, number][]) => {
          const newMap = [...prev];
          newMap.push([sdsd[0], sdsd[1] + 1, sdsd[2]]);
          return newMap;
        });
        
      }
    };

    const mesh = meshRef.current;

    if (mesh) {
      gl.domElement.addEventListener('pointerdown', handleMouseDown);
    }

    return () => {
      if (mesh) {
        gl.domElement.removeEventListener('pointerdown', handleMouseDown);
      }
    };
  }, [sdsd, gl, camera, id]);

  const textureLoader = new THREE.TextureLoader();
  const textures = [
    textureLoader.load('https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSC4DtHTGprsp7K8u0ZlfSDmIDplvQYH5vniT0I3rpcl6wqBh8b'),
    textureLoader.load('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYml4a2o5ZGd0YzgxdGN3aDJmZnAwZ3k1aGw2ZHFzZ2xvbG9zdTRlbyZlcD12MV9pbnRlcm5naWZfYnlfaWQmY3Q9Zw/BVSMbtX5ZRGqwnCQnX/giphy.webp'),
    textureLoader.load('https://example.com/image3.jpg'),
    textureLoader.load('https://example.com/image4.jpg'),
    textureLoader.load('https://example.com/image5.jpg'),
    textureLoader.load('https://example.com/image6.jpg'),
  ];

  return (
    <mesh 
      ref={meshRef} 
      position={sdsd}
      >
      <boxGeometry args={[1, 1, 1]} />
      {textures.map((texture, index) => (
        <meshStandardMaterial
          key={index} 
          attach={`material-${index}`} map={texture} />
      ))}
    </mesh>
  );
};

const App = () => {

  const [map3D, setMap3D] = React.useState(
    [
      [1, 0, 0],
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, -1],
      [0, 0, -1],
      [0, 0, 0],
      [-1, 0, 0],
    ]
  );    

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {map3D.map((position, index) => (
        <RotatingCube key={index} sdsd={position} id={index} setsds={setMap3D} />
      ))}
    </Canvas>
  );
};

export default App;