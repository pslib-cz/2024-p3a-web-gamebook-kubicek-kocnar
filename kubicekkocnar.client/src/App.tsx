import './App.css';
import Map from './components/map/Map';
import { Canvas } from '@react-three/fiber'
import React from 'react';
import * as THREE from 'three';
import { AppContextProvider } from './components/AppContextProvider';
import ToolBar from './components/editor/ToolBar';
//@ts-expect-error types are missing
import 'react-material-symbols/outlined';
import ConfigPanel from './components/editor/ConfigPanel';

function App() {
    
    const [scene, setScene] = React.useState<THREE.Scene | null>(null);
  
    return (
        <AppContextProvider>
            <ToolBar />
            <ConfigPanel/>
            <div className='canvas'>
            <Canvas onCreated={(state) => {console.log(state); setScene(state.scene)}}>
                {scene && <Map scene={scene}/>}
                {/* <h1 id="tableLabel">Weather forecast</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents} */}
            </Canvas>
            </div>

        </AppContextProvider>
    );
}

export default App;