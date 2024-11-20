import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Block from './Block';
import type BlockType from '../../types/Block';
import BlockFace from '../../types/BlockFace';

const App = () => {

  

    const [map3D, setMap3D] = React.useState<BlockType[]>(
      [
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
        },
      ]);
  
    const handleBlockClick = (blockId: number, face: BlockFace, distance: number) => {
        console.log(`Mouse button down on cube ${blockId}, face ${BlockFace[face]}, distance ${distance}`);
        
        const clickedBlock = map3D.find(block => block.blockId === blockId);
        if (!clickedBlock) return;

        const newPosition = [...clickedBlock.position];
        newPosition[Math.floor(face / 2)] += face % 2 === 0 ? 1 : -1;
        //make the switch shorter
        
        console.log(`New position: ${newPosition}`);

        setMap3D([...map3D, { position: newPosition, blockId: map3D.length + 1 }] as BlockType[]);
    };

    return (
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <axesHelper args={[20]} /> // x = red, y = green, z = blue
        {map3D.map((block, index) => (
          <Block key={index} block={block} onClick={handleBlockClick}  />
        ))}
      </Canvas>
    );
  };
  
  export default App;