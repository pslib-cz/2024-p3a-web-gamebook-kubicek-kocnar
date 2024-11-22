import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Block from './Block';
import type BlockType from '../../types/Block';
import BlockFace from '../../types/BlockFace';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

import Player from '../Player';
import MapRender from '../../lib/MapRender';

// TODO: unify mesh creating in Block and in MapRenderer
// TODO: add a way to remove blocks
// TODO: fix face detection / new position calculation

const MapRenderer = ({scene} : {scene : THREE.Scene}) => {

    console.log("Rerendering MapRenderer");

    const handleMapPointerDown = (event: MouseEvent) => {
      //get the block that was clicked
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const faceIndex = intersects[0].faceIndex;
        console.log(intersects[0]);
        
        if (faceIndex !== undefined) {
          const distance = intersects[0].distance;
          console.log(`V2: Mouse button down on cube ${intersects[0].object.id}, face ${MapRender.translateFaceIndex(faceIndex||0)}, faceIndex ${faceIndex||0} distance ${distance}`);
        }
      }
    }

    const map3D = React.useRef<BlockType[]>(
      [
        {
          position: [0, 10, 0],
          blockId: 100
        },
        {
          position: [-1, -1, 0],
          blockId: 1
        },
        {
          position: [-1, 0, 0],
          blockId: 2
        },
        {
          position: [-1, 1, 0],
          blockId: 3
        },
        {
          position: [0, -1, 0],
          blockId: 4
        },
        {
          position: [0, 0, 0],
          blockId: 5
        },
        {
          position: [0, 1, 0],
          blockId: 6
        },
        {
          position: [1, -1, 0],
          blockId: 7
        },
        {
          position: [1, 0, 0],
          blockId: 8
        },
        {
          position: [1, 1, 0],
          blockId: 9
        }
      ]);

      const { gl, camera } = useThree();

    const blocksToRender = React.useRef<BlockType[]>([]);

    console.log(scene);

    const MapRenderer = new MapRender(scene);

    map3D.current.forEach((block) => MapRenderer.addBlock(block));

    gl.domElement.addEventListener('pointerdown', handleMapPointerDown);

    
    
    
    
    
  
    const handleBlockClick = (blockId: number, face: BlockFace, distance: number) => {
        console.log(`Mouse button down on cube ${blockId}, face ${BlockFace[face]}, distance ${distance}`);
        
        let clickedBlock: BlockType | THREE.Object3D | undefined = map3D.current.find(block => block.blockId === blockId);

        if (!clickedBlock) clickedBlock = scene.children.find((child: any) => child.userData.blockId === blockId);

        if (!clickedBlock)
        {
          throw new Error(`Block with id ${blockId} not found`);
        }

        const newPosition = [...clickedBlock.position];
        newPosition[Math.floor(face / 2)] += face % 2 === 0 ? 1 : -1;
        //make the switch shorter
        
        console.log(`New position: ${newPosition}`);

        // setMap3D([...map3D, { position: newPosition, blockId: map3D.length + 1 }] as BlockType[]);

        const newBlock = { position: newPosition, blockId: map3D.current.length + 1 + 999 } as BlockType;
        blocksToRender.current.push(newBlock);
    };

    const handlePointerDown = (event: MouseEvent, OnClick_: (blockId: number, faceIndex: number, distance: number) => void, meshRef: THREE.Mesh, block: BlockType, blocksds : number) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(meshRef);
      if (intersects.length > 0) {
        const faceIndex = intersects[0].face?.materialIndex;
        if (faceIndex !== undefined) {
          const distance = intersects[0].distance;
          OnClick_(blocksds, faceIndex, distance);
        }
      }
    };

    useFrame(() => {
      // This will trigger a re-render only for the Three.js scene, not React
      if (scene) {

        blocksToRender.current.forEach((block) => {
          const blockMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
          );
          blockMesh.position.set(block.position[0], block.position[1], block.position[2]);
          blockMesh.userData = { blockId: block.blockId };

          const handlePointerDownWrapper = (event: MouseEvent) => handlePointerDown(event, handleBlockClick, blockMesh, block, blockMesh.userData.blockId);
          gl.domElement.addEventListener('pointerdown', handlePointerDownWrapper);
          blockMesh.userData.handlePointerDownWrapper = handlePointerDownWrapper;
          
          scene.add(blockMesh);
        });

        blocksToRender.current = [];
      }
    });

    return (
      <>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <axesHelper args={[20]} /> // x = red, y = green, z = blue

        <Player />
      </>
    );
  };

  export default MapRenderer;
