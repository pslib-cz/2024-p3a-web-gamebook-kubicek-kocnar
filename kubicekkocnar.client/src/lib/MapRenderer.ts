import * as THREE from 'three';
import type PlacedBlock from '../types/PlacedBlock';
import Block from '../types/Block';
import Blocks from './Blocks';
import Texture from '../types/Texture';

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

class MapRenderer {

    scene: THREE.Scene;

    blocks: PlacedBlock[] = [];

    blocksReference: Blocks;

    blockCounter = 0;


    constructor(scene: THREE.Scene, blocksReference: Blocks) {
        this.scene = scene;
        this.blocksReference = blocksReference;
    }

    static loadTexture(texture: Texture): Blob {
        const byteCharacters = atob(texture.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        return new Blob([new Uint8Array(byteNumbers)], { type: texture.type ? texture.type : 'image/png'});
    }


    public addBlock(placedBlock: PlacedBlock) {
        // if the blockId exists in this.blocks, we dont add it
        if (this.blocks.find(b => b.placedBlockId === placedBlock.placedBlockId)) {
            console.error("This block is already in the scene", placedBlock.placedBlockId);
            return;
        }

        // this generates the material for the block, or uses the existing one if this type of block was already rendered
        placedBlock.block = this.blocksReference.blocks.find(b => b.blockId === placedBlock.blockId)!;
        
        this.createBlockMaterial(placedBlock.block);

        if (!placedBlock.placedBlockId) {
            // clientside blocks have a placedBlockId above 1000000
            placedBlock.placedBlockId = 1000000 + this.blockCounter++;
        }

        placedBlock.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            placedBlock.block.material,
        );

        // set the mesh name for better identification
        placedBlock.mesh.name = 'block ' + placedBlock.block.name + ' ' + placedBlock.placedBlockId;

        // set the attributes and state of the block as userData
        placedBlock.mesh.userData.attributes = placedBlock.block.attributes.concat('block')
        placedBlock.mesh.userData.state = placedBlock.state;

        placedBlock.mesh.position.set(placedBlock.position.x, placedBlock.position.y, placedBlock.position.z);
        
        //console.log("MapRenderer -> ADD ", placedBlock.mesh.name, placedBlock.mesh.position);

        this.blocks.push(placedBlock);
        this.scene.add(placedBlock.mesh);
    }

    private createBlockMaterial(block: Block) {
        //console.log('Creating material for block', block);
        
        // if the block already has a material (its not the first one), we dont have to create the material
        if (block.material === undefined) {
            // if the block has a texture, we create a material with the texture
            if (block.texture0) {
                // if there is only one texture, we use it for all sides
                if (!block.texture5) {
                    // create a URL from the Blob
                    const loadedTexture = textureLoader.load(URL.createObjectURL(MapRenderer.loadTexture(block.texture0)));
                    // avoid blurring for pixel art
                    loadedTexture.minFilter = THREE.NearestFilter;
                    loadedTexture.magFilter = THREE.NearestFilter;

                    block.material = new THREE.MeshStandardMaterial({ map: loadedTexture });
                } else {
                    block.material = [block.texture0, block.texture1, block.texture2, block.texture3, block.texture4, block.texture5].map(texture => {
                        if (!texture) texture = block.texture0; 
                    const loadedTexture = textureLoader.load(URL.createObjectURL(MapRenderer.loadTexture(texture!)));
                        loadedTexture.minFilter = THREE.NearestFilter;
                        loadedTexture.magFilter = THREE.NearestFilter;
                        return new THREE.MeshStandardMaterial({ map: loadedTexture, blendSrc: THREE.OneFactor });
                    });;
                }
            } else
            // a fallback material if the block has no texture
            block.material = new THREE.MeshStandardMaterial({ color: 0xde7c26 });
        }
    }

    public removeBlock(placedBlock: PlacedBlock) {
        // find the block in the blocks array and remove it and the mesh from the scene
        const removeIndex = this.blocks.findIndex(b => b.placedBlockId === placedBlock.placedBlockId);
        if (removeIndex > -1) {
            console.log('MapRenderer -> RM ', placedBlock.mesh?.name, placedBlock.mesh?.position);
            this.scene.remove(placedBlock.mesh as THREE.Mesh);
            this.blocks.splice(removeIndex, 1);
        }
    }

    public updateBlock(placedBlock: PlacedBlock) {
        // remove the block and add it again
        this.removeBlock(placedBlock);
        this.addBlock(placedBlock);
    }



    // a helper function to translate the blcok side index to a string
    public static translateTextureSide(sideIndex: number) : string {
        const sides = ['Left (x+)', 'Right (x-)', 'Top (y+)', 'Bottom (y-)', 'Front (z+)', 'Back (z-)'];
        return sides[sideIndex];
    }

    static transformBlock(block: {x: number, y: number, z: number}) {
        return {
            ...block,
            position: new THREE.Vector3(block.x, block.y, block.z)
        }  as unknown as PlacedBlock;
    }

}

export default MapRenderer;