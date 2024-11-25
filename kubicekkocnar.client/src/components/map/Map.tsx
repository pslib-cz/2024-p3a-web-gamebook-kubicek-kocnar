import React, { useContext, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import type BlockType from '../../types/Block';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

import Player from '../Player';
import MapRender from '../../lib/MapRender';
import { AppContext } from '../AppContextProvider';
import { Tool } from '../editor/ToolBar';

const Map = ({scene} : {scene : THREE.Scene}) => {

  const { tool, setBlock } = useContext(AppContext);

  useEffect(() => {
    console.log("Rerendering MapRenderer");
  }, [scene])

    const handleMapPointerDown = (event: MouseEvent) => {
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
            break;
          } case Tool.Add: { 
            if (intersects[0].face?.normal === undefined) return;
            const newPos = intersects[0].object.position.clone().add(intersects[0].face?.normal);
            const newBlock = { 
              position: [newPos.x, newPos.y, newPos.z],
              texture: { sides: [
                { url: 'https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp' },
                { url: 'https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp' },
                { url: 'https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp' },
                { url: 'https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp' },
                { url: 'https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp' },
                { url: 'https://cdn.midjourney.com/068c3502-d972-477e-a167-c3d8179f2ca3/grid_0_640_N.webp' },
              ] },
            } as BlockType;
            mapRender.addBlock(newBlock);
            break; 
          } case Tool.Remove: {
            console.log(mapRender.blocks);
            
            const block = mapRender.blocks.find(block => block.position[0] === intersects[0].object.position.x && block.position[1] === intersects[0].object.position.y && block.position[2] === intersects[0].object.position.z);
            if (block) {
              mapRender.removeBlock(block);
            }
            break;
          }
        }

      }
    }

    const map3D = React.useRef<BlockType[]>(
      [
        {
          position: [0, 0, 0],
          blockId: 1
        }
      ]);

      const { gl, camera } = useThree();

    console.log(scene);

    const mapRender = new MapRender(scene);

    map3D.current.forEach((block) => mapRender.addBlock(block));

    gl.domElement.addEventListener('click', handleMapPointerDown);

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

  export default Map;
