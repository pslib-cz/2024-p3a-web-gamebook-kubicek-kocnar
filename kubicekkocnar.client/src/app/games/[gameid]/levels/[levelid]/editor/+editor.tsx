import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Canvas } from "@react-three/fiber";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContextProvider } from "../../../../../../components/AppContextProvider";
import ConfigPanel from "../../../../../../components/editor/ConfigPanel";
import ToolBar from "../../../../../../components/editor/ToolBar";
import { ItemUI } from "../../../../../../components/ItemController";
import { UIOverlay } from "../../../../../../components/ui/player/InventoryOverlay";
import Blocks from "../../../../../../lib/Blocks";
import Level from "../../../../../../lib/Level";
import MapRenderer from "../../../../../../lib/MapRenderer";
import Map from '../../../../../../components/map/Map';
import * as THREE from 'three';
import AuthWidget from "../../../../../../components/auth/AuthWidget";
import SaveHandler, { Save } from "../../../../../../lib/SaveHandler";


function LevelEditor() {
  const auth: MutableRefObject<Save['auth'] | null> = useRef(null);
  const { gameid, levelid } = useParams();
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [level, setLevel] = useState<Level | null>(null);

  async function Reload() {
    auth.current = await SaveHandler.getAuth();
  }

  useEffect(() => { Reload(); }, []);

  React.useEffect(() => {
    if (!scene) {
      console.error("Scene not ready yet...");
      return;
    }
    if (!gameid || !levelid) {
      console.error("Invalid URLd");
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
      {auth.current && <AuthWidget auth={auth.current} className="authwidget--nob" />}
      <AppContextProvider>
        {!level && <div className="loader"></div>}
        <ToolBar />
        {level && <ConfigPanel level={level} />}
        <div className='canvas' id="gameroot">
          <Canvas onCreated={(state) => {
            state.camera.position.set(0, 3, 0);
            state.scene.userData.camera = state.camera;
            state.scene.background = new THREE.Color(0x0e0726);
            setScene(state.scene);
          }}>
            {level && <Map level={level} isEditor />}
          </Canvas>
          <ItemUI />
          <UIOverlay />
        </div>
      </AppContextProvider>
    </TooltipProvider>
  )
}

export default LevelEditor;