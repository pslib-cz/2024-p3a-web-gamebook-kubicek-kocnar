import React, { useContext, useEffect, useCallback } from 'react';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

import Player from '../Player';
import MapRenderer from '../../lib/MapRenderer';
import { AppContext } from '../AppContextProvider';
import { Tool } from '../editor/ToolBar';
import Level from '../../types/Level';
import MapEditor from '../../lib/MapEditor';

// React.memo(
const Map = ({scene, level} : {scene : THREE.Scene, level : Level}) => {

  console.log("Loading level");
  console.log(level);

  const { tool, setBlock } = useContext(AppContext);
  const threeRef = React.useRef(useThree());
  const { gl, camera } = threeRef.current;
  
  // create a new MapRenderer instance and remember it between rerenders
  const mapRendererRef = React.useRef<MapRenderer | null>(null);
  if (!mapRendererRef.current) {
    mapRendererRef.current = new MapRenderer(scene);
  }
  const mapRenderer = mapRendererRef.current;
  console.log("Rerendering MapRenderer");

  // create a new MapEditor instance and remember it between rerenders
  const mapEditorRef = React.useRef<MapEditor | null>(null);
  if (!mapEditorRef.current) {
    mapEditorRef.current = new MapEditor(mapRenderer);
  }
  const mapEditor = mapEditorRef.current;
  
  // move the cursor cube to the position of the mouse
  const handleMouseMove = useCallback((event: MouseEvent) => {
    mapEditor.moveCursorOutline(event, scene, camera);
  }, [scene, camera, mapEditor]);

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
      const selectedBlock = mapRenderer.blocks.find(block => block.mesh?.id === intersects[0].object.id);
      if (!selectedBlock) return;
      switch (tool.current) {
        case Tool.Mouse: {
          if (selectedBlock) setBlock(selectedBlock);
          scene.getObjectByName("selectioncube")?.position.set(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z);
          break;
        } case Tool.Add: { 
          if (intersects[0].face?.normal === undefined) return;
          const newPos = intersects[0].object.position.clone().add(intersects[0].face?.normal);
          const newBlock = structuredClone(selectedBlock);
          newBlock.position = newPos;
          mapRenderer.addBlock(newBlock);
          break; 
        } case Tool.Remove: {
          const block = mapRenderer.blocks.find(block => block.mesh === intersects[0].object);
          if (block) {
            mapRenderer.removeBlock(block);
          }
          break;
        }
      }

    }
  }, [tool, setBlock, mapRenderer, scene, camera]);

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

    level.blocks.forEach((block) => mapRenderer.addBlock(block));
    console.log(scene);
  }, [mapRenderer, scene, level],);

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
}//); , () => true

  export default Map;
