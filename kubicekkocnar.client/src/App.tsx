import './App.css';
import Map from './components/map/Map';
import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react';
import * as THREE from 'three';
import { AppContextProvider } from './components/AppContextProvider';
import ToolBar from './components/editor/ToolBar';
//@ts-expect-error types are missing
import 'react-material-symbols/outlined';
import ConfigPanel from './components/editor/ConfigPanel';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { LevelMenu } from './LevelMenu';
import Level from './lib/Level';
import MapRenderer from './lib/MapRenderer';
import Blocks from './lib/Blocks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"> {/* na Layout.tsx*/}
          <Route index element={<LevelEditor />} />
          <Route path="games" element={<LevelMenu />} />
          <Route path="games/:gameid/levels/:levelid" element={<LevelEditor/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
}

function LevelEditor()
{
  const { gameid, levelid } = useParams();
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  //const [blocks, setBlocks] = useState<Blocks | null>(null);

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
    <AppContextProvider>
      <ToolBar />
      {level && <ConfigPanel/>}
      <div className='canvas'>
      <Canvas onCreated={(state) => setScene(state.scene)}>
        {level && <Map level={level}/>}
      </Canvas>
      </div>
    </AppContextProvider>
  )
}

export default App;