import Texture from "./Texture";
import * as THREE from 'three';

interface Block {
    blockId: number;
    position: THREE.Vector3;
    material?: THREE.Material | THREE.Material[];
    mesh?: THREE.Mesh;
    texture0: Texture;
    texture1: Texture | undefined;
    texture2: Texture | undefined;
    texture3: Texture | undefined;
    texture4: Texture | undefined;
    texture5: Texture | undefined;
}

interface PlacedBlock {
    placedBlockId: number;
    blockId: number;
    block: Block;
    level: number;
    x: number;
    y: number
    z: number;
} 

export default Block;
