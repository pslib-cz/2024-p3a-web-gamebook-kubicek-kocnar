import * as THREE from 'three';
import BlockType from '../types/Block';

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

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
                if (block.texture.sides.length === 1) {
                    const texture = block.texture.sides[0];
                    const loadedTexture = textureLoader.load(texture.url);
                    loadedTexture.minFilter = THREE.NearestFilter;
                    // render the texture without any smoothing - pixelated
                    loadedTexture.magFilter = THREE.NearestFilter;
                    block.material = new THREE.MeshStandardMaterial({ map: loadedTexture });
                } else {
                    const textures = block.texture.sides.map(side => {
                        const loadedTexture = textureLoader.load(side.url);
                        loadedTexture.minFilter = THREE.NearestFilter;
                        // render the texture without any smoothing - pixelated
                        loadedTexture.magFilter = THREE.NearestFilter;
                        return new THREE.MeshStandardMaterial({ map: loadedTexture, blendSrc: THREE.OneFactor });
                    });
                    block.material = textures;
                }
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

    public static translateTextureSide(sideIndex: number) : string {
        const sides = ['Left (x+)', 'Right (x-)', 'Top (y+)', 'Bottom (y-)', 'Front (z+)', 'Back (z-)'];
        return sides[sideIndex];
    }

}

export default MapRender;