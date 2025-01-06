import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AppContextProvider } from "../../../../../components/AppContextProvider";
import { getHandlePlayerMouseClick, ItemUI } from "../../../../../components/ItemController";
import { UIOverlay } from "../../../../../components/UIOverlay";
import Blocks from "../../../../../lib/Blocks";
import Level from "../../../../../lib/Level";
import MapRenderer from "../../../../../lib/MapRenderer";
import Map from '../../../../../components/map/Map';
import * as THREE from 'three';


function LevelPlayer()
{
  const { gameid, levelid } = useParams();
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [level, setLevel] = useState<Level | null>(null);

  React.useEffect(() => {
    if (!scene) {
      console.error("Scene not ready yet...");
      return;
    }
    if (!gameid || !levelid) {
      console.error("Invalid URL");
      return;
    }  
    
    new Blocks((blocks) => {
      const mapRenderer = new MapRenderer(scene, blocks);
      new Level(parseInt(gameid), parseInt(levelid), mapRenderer, (level) => {
        setLevel(level);
      });
    });
  }, [gameid, levelid, scene])

  return (
    <TooltipProvider>
      <AppContextProvider>
        {!level && <div className="loader"></div>}
        <div className='canvas'>
          <Canvas onCreated={(state) => {
              state.camera.position.set(0, 3, 0);
              state.scene.userData.camera = state.camera;
              state.scene.background = new THREE.Color(0x0e0726);
              setScene(state.scene);
            }}>
            {level && <Map level={level}  onPointerDown={getHandlePlayerMouseClick}/>}
          </Canvas>
          <ItemUI/>
          <UIOverlay/>
        </div>
      </AppContextProvider>
    </TooltipProvider>
  )
}

export default LevelPlayer;