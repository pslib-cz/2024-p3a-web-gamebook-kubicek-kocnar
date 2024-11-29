import './App.css';
import Map from './components/map/Map';
import { Canvas } from '@react-three/fiber'
import React, { useEffect } from 'react';
import { useState } from 'react';
import * as THREE from 'three';
import { AppContextProvider } from './components/AppContextProvider';
import ToolBar from './components/editor/ToolBar';
//@ts-expect-error types are missing
import 'react-material-symbols/outlined';
import ConfigPanel from './components/editor/ConfigPanel';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import { LevelMenu } from './LevelMenu';
import Block from './types/Block';
import { Level } from './types/Level';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"> {/* na Layout.tsx*/}
          <Route index element={<LevelEditor />} />
          <Route path="levels" element={<LevelMenu />} />
          <Route path="levels/:id" element={<LevelEditor/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
}

const map3D: Block[] = [
  {
    position: [0, 0, 0],
    blockId: 1
  },
  {
    position: [0, 0, 1],
    blockId: 2
  },
  {
    position: [0, 0, -1],
    blockId: 3
  },
  {
    position: [1, 0, 0],
    blockId: 4
  },
  {
    position: [-1, 0, 0],
    blockId: 5
  },
  {
    position: [-2, 0, 0],
    blockId: 6
  },
  {
    position: [-3, 0, 0],
    blockId: 7   
  },
  {
    position: [-4, 0, 0],
    blockId: 8
  },
  {
    position: [-4, 1, 0],
    blockId: 9
  },
];

function LevelEditor()
{
  const { id } = useParams();
  const [scene, setScene] = useState<THREE.Scene | null>(null);

  const demoLevel = {
    name: "demo",
    blocks: map3D
  } as Level


  const [level_, setLevel] = useState<Level>(demoLevel);

  React.useEffect(() => {
    console.log("Level ID:", id);
    
    if (id == null)
    {
      setLevel(demoLevel);
      return;
    }

    const endpoint = 'https://localhost:7097/api/Levels/';
  
    async function fetchLevel() {

      console.log("Fetching level");

      try {
        const response = await fetch(endpoint + id);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const level: Level = await response.json();
        setLevel(level);

        console.log(`Level found`);
        console.log(level);

      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }

    fetchLevel();

  }, [id]);

  useEffect(() =>{
    console.log(level_);
  }, [level_])
  
  return(
    <AppContextProvider>
      <ToolBar />
      <ConfigPanel/>
      <div className='canvas'>
      <Canvas onCreated={(state) => {console.log(state); setScene(state.scene)}}>
        {scene && <Map scene={scene} level={level_}/>}
      </Canvas>
      </div>
    </AppContextProvider>
  )
}

export default App;