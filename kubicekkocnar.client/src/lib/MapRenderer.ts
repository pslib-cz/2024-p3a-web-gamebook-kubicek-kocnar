import * as THREE from 'three';
import type PlacedBlock from '../types/PlacedBlock';
import Block from '../types/Block';
import Blocks from './Blocks';
import { GetTextureURL } from '../api/Textures';

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

  public addBlock(placedBlock: PlacedBlock) {
    // if the blockId exists in this.blocks, we dont add it
    if (this.blocks.find(b => b.placedBlockId === placedBlock.placedBlockId)) return;

    // this generates the material for the block, or uses the existing one if this type of block was already rendered
    placedBlock.block = this.blocksReference.blocks.find(b => b.blockId === placedBlock.blockId)!;

    this.createBlockMaterial(placedBlock.block);

    if (!placedBlock.placedBlockId) {
      // clientside blocks have a placedBlockId above 1000000
      placedBlock.placedBlockId = 1000000 + this.blockCounter++;
    }

    placedBlock.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      placedBlock.block.material,
    );

    // set the mesh name for better identification
    placedBlock.mesh.name = 'block ' + placedBlock.block.name + ' ' + placedBlock.placedBlockId;

    // set the attributes and state of the block as userData
    placedBlock.mesh.userData.attributes = placedBlock.block.attributes.concat('block')
    placedBlock.mesh.userData.state = placedBlock.state;

    placedBlock.mesh.position.set(placedBlock.position.x, placedBlock.position.y, placedBlock.position.z);

    this.blocks.push(placedBlock);
    this.scene.add(placedBlock.mesh);
  }

  private createBlockMaterial(block: Block) {
    // if the block already has a material (its not the first one), we dont have to create the material
    if (block.material === undefined) {
      // if the block has a texture, we create a material with the texture
      if (block.texture0Id != 0) {
        // if there is only one texture, we use it for all sides
        if (block.texture0Id == 0) {
          // create a URL from the Blob
          const loadedTexture = textureLoader.load(GetTextureURL(block.texture0Id));
          // avoid blurring for pixel art
          loadedTexture.minFilter = THREE.NearestFilter;
          loadedTexture.magFilter = THREE.NearestFilter;

          block.material = new THREE.MeshStandardMaterial({ map: loadedTexture });
        } else {
          block.material = [block.texture0Id, block.texture1Id, block.texture2Id, block.texture3Id, block.texture4Id, block.texture5Id].map(texture => {
            if (!texture) texture = block.texture0Id;
            const loadedTexture = textureLoader.load(GetTextureURL(texture!));
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
  public static translateTextureSide(sideIndex: number): string {
    const sides = ['Left (x+)', 'Right (x-)', 'Top (y+)', 'Bottom (y-)', 'Front (z+)', 'Back (z-)'];
    return sides[sideIndex];
  }

  static transformBlock(block: { x: number, y: number, z: number }) {
    return {
      ...block,
      position: new THREE.Vector3(block.x, block.y, block.z)
    } as unknown as PlacedBlock;
  }

}

export default MapRenderer;