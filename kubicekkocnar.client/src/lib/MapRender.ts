import * as THREE from 'three';
import BlockType from '../types/Block';

const textureLoader = new THREE.TextureLoader();

class MapRender {

    public scene: THREE.Scene;

    public blocks: BlockType[] = [];


    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public addBlock(block: BlockType) {
        // if the blockId exists in this.blocks, we dont add it
        if (this.blocks.find(b => b.blockId === block.blockId)) {
            console.log("Block already exists");
            return;
        }
        
        if (block.material === undefined) {
            if (block.texture !== undefined) {
                const textures = block.texture.sides.map(side => new THREE.MeshStandardMaterial({ map: textureLoader.load(side.url) }));
                block.material = textures;
            } else
            block.material = new THREE.MeshStandardMaterial({ color: 0xde7c26 });
        }
        if (!block.blockId) {
            block.blockId = 10000 + this.blocks.length;
        }
        const blockMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            block.material,
        );
        blockMesh.name = `block block-${block.blockId}`;
        blockMesh.position.set(block.position[0], block.position[1], block.position[2]);
        block.mesh = blockMesh;
        console.log("ADD", block);
        this.blocks.push(block);
        this.scene.add(block.mesh);
    }

    public removeBlock(block: BlockType) {
        const index = this.blocks.findIndex(b => b.blockId === block.blockId);
        if (index > -1) {
            console.log('RM '+index, block);
            this.scene.remove(block.mesh as THREE.Mesh);
            this.blocks.splice(index, 1);
        }
    }

    public updateBlock(block: BlockType) {
        this.removeBlock(block);
        this.addBlock(block);
    }

    public static translateFaceIndex(faceIndex: number) : string {
        // each side of the cube has 2 triangles, translating the face index to the side of the cube
        switch (faceIndex) {
            case 0:
            case 1:
                return "right";
            case 2:
            case 3:
                return "back";
            case 4:
            case 5:
                return "top";
            case 6:
            case 7:
                return "bottom";
            case 8:
            case 9:
                return "front";
            case 10:
            case 11:
                return "back";
            default:
                return "unknown";
        }
    }

}

export default MapRender;