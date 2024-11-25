import React, { useContext, useEffect, useCallback } from 'react';
import { OrbitControls, Stats } from '@react-three/drei';
import type BlockType from '../../types/Block';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

import Player from '../Player';
import MapRender from '../../lib/MapRender';
import { AppContext } from '../AppContextProvider';
import { Tool } from '../editor/ToolBar';

const Map = React.memo(({scene} : {scene : THREE.Scene}) => {

  const { tool, setBlock } = useContext(AppContext);
  const threeRef = React.useRef(useThree());
  const { gl, camera } = threeRef.current;
  
  const mapRenderRef = React.useRef<MapRender | null>(null);
  if (!mapRenderRef.current) {
    mapRenderRef.current = new MapRender(scene);
  }

  const mapRender = mapRenderRef.current;


  console.log("Rerendering MapRenderer");

  // move the cursor cube to the position of the mouse
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children)
      .filter(intersect => intersect.object.name.includes("block"));
    
    if (intersects.length > 0) {
      scene.getObjectByName("cursorcube")?.position.set(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z);
    }
  }, [scene, camera]);

  const handleMapPointerDown = useCallback((event: MouseEvent) => {
    //get the block that was clicked
    
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children)
      .filter(intersect => intersect.object.name.includes("block"));
    
    if (intersects.length > 0) {
      switch (tool.current) {
        case Tool.Mouse: {
          const selectedBlock = mapRender.blocks.find((block) => block.position[0] === intersects[0].object.position.x && block.position[1] === intersects[0].object.position.y && block.position[2] === intersects[0].object.position.z);
          if (selectedBlock) setBlock(selectedBlock);
          scene.getObjectByName("selectioncube")?.position.set(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z);
          break;
        } case Tool.Add: { 
          if (intersects[0].face?.normal === undefined) return;
          const newPos = intersects[0].object.position.clone().add(intersects[0].face?.normal);
          const newBlock = { 
              position: [newPos.x, newPos.y, newPos.z],
              texture: { sides: [
                { url: 'https://i.ibb.co/9WpcyH5/texture-empty.png' },
                { url: 'https://i.ibb.co/9WpcyH5/texture-empty.png' },
                { url: 'https://i.ibb.co/9WpcyH5/texture-empty.png' },
                { url: 'https://i.ibb.co/9WpcyH5/texture-empty.png' },
                { url: 'https://i.ibb.co/9WpcyH5/texture-empty.png' },
                { url: 'https://i.ibb.co/9WpcyH5/texture-empty.png' },
              ] },
            } as BlockType;
          mapRender.addBlock(newBlock);
          break; 
        } case Tool.Remove: {
          const block = mapRender.blocks.find(block => block.position[0] === intersects[0].object.position.x && block.position[1] === intersects[0].object.position.y && block.position[2] === intersects[0].object.position.z);
          if (block) {
            mapRender.removeBlock(block);
          }
          break;
        }
      }

    }
  }, [tool, setBlock, mapRender, scene, camera]);

  useEffect(() => {
    console.log("Adding event listeners");
    gl.domElement.addEventListener('click', handleMapPointerDown);
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    return () => {
      gl.domElement.removeEventListener('click', handleMapPointerDown);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMapPointerDown, handleMouseMove, gl.domElement]);

  useEffect(() => {
    console.log("MapRenderer mounted");
    // initial map setup
    const map3D: BlockType[] = [
      {
        position: [0, 0, 0],
        blockId: 1
      }
    ];
    map3D.forEach((block) => mapRender.addBlock(block));
    console.log(scene);
  }, [mapRender, scene]);

    return (
      <>
        <OrbitControls />
        <Stats className='stats'/>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 10, 0]} intensity={50}/> 
        <axesHelper args={[20]} /> // x = red, y = green, z = blue

        <lineSegments name="cursorcube" position={[0, 1000, 0]} scale={1.001}>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial attach="material" color="white" />
        </lineSegments>
        <lineSegments name="selectioncube" position={[0, 1000, 0]} scale={1.002}>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial attach="material" color="yellow" />
        </lineSegments>
        <mesh position={[0, 0, 0]}>
          
          <meshStandardMaterial color={0x00ff00} />
        </mesh>
        <Player />
      </>
    );
  //never rerender :D
}, () => true);

  export default Map;
