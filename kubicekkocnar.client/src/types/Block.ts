import BlockTexture from "./Texture";
import * as THREE from 'three';

interface Block {
    blockId: number;
    position: [number, number, number];
    texture?: BlockTexture;
    material?: THREE.Material | THREE.Material[];
    mesh?: THREE.Mesh;
}

export default Block;
