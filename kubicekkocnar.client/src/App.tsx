import './App.css';
import MapRenderer from './components/map/MapRenderer';
import { Canvas, useFrame } from '@react-three/fiber'
import React from 'react';
import * as THREE from 'three';

function App() {
    
  const [scene, setScene] = React.useState<THREE.Scene | null>(null);
  
    return (
      <div className='canvas'>


        <Canvas onCreated={(state) => {console.log(state); setScene(state.scene)}}>
            {scene && <MapRenderer scene={scene}/>}
            {/* <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents} */}
        </Canvas>
        </div>
    );
}

export default App;