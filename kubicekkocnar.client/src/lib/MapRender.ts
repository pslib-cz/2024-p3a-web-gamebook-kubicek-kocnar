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
            if (block.texture1 !== undefined) {
                if (!block.texture5) {
                    const loadedTexture = textureLoader.load(block.texture1.url);
                    loadedTexture.minFilter = THREE.NearestFilter;
                    loadedTexture.magFilter = THREE.NearestFilter;
                    block.material = new THREE.MeshStandardMaterial({ map: loadedTexture });
                } else {
                    block.material = [block.texture0, block.texture1, block.texture2, block.texture3, block.texture4, block.texture5].map(texture => {
                        const loadedTexture = textureLoader.load(texture?.url || '');
                        loadedTexture.minFilter = THREE.NearestFilter;
                        loadedTexture.magFilter = THREE.NearestFilter;
                        return new THREE.MeshStandardMaterial({ map: loadedTexture, blendSrc: THREE.OneFactor });
                    });;
                }
            } else
            block.material = new THREE.MeshStandardMaterial({ color: 0xde7c26 });
        }
        if (!block.blockId) {
            block.blockId = 10000 + this.blocks.length;
        }
        block.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            block.material,
        );
        block.mesh
        block.mesh.u = `block block-${block.blockId}`;
        block.mesh.position.set(block.position?.x, block.position?.y, block.position?.z);
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