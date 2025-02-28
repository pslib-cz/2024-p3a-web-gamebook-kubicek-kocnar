
import * as THREE from 'three';
import PlacedBlock from '../types/PlacedBlock';
import { EnemyRenderer } from './Enemy';

class CorruptionHandler {
  private enemySpawnChance: number = 0.01;
  private corruptionChance: number = 0.2;

  private interval: NodeJS.Timeout | null = null;

  private revertedBlocks: PlacedBlock[] = [];

  constructor(private corruptedBlocks: PlacedBlock[], private allBlocks: PlacedBlock[], private enemyHandler: EnemyRenderer) 
  {
    if (this.corruptedBlocks.length == 0) {
      console.warn("No corrupted blocks found");
    }

    if (this.allBlocks.length == 0) {
      console.warn("No blocks found");
    }

    if (this.corruptedBlocks >= this.allBlocks) {
      console.warn("Corrupted blocks should be less than all blocks");
    }
  }

  start() {

    console.error("Starting corruption"); 

    this.interval = setInterval(() => {
      this.corruptedBlocks.forEach((corruptedBlock) => {
        if (Math.random() < this.enemySpawnChance)
          this.enemyHandler?.spawnRandomEnemy();

        const adjancedBlocks = this.allBlocks.filter((block) => block.position.distanceTo(corruptedBlock.position) < 1.5);
        adjancedBlocks.forEach((block) => {
          if (block.state.includes("corrupt") || Math.random() > this.corruptionChance) return;

          block.state += "corrupt ";
          block.mesh.userData.oldMaterial = block.mesh.material;
          block.mesh.material = new THREE.MeshStandardMaterial({ color: 0xff00ff });
          this.corruptedBlocks.push(block);
        });
      });
    }, 250);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  revert(from: PlacedBlock) {
    this.stop();

    console.error("Reverting corruption");

    from.state = from.state += "reverted ";
    if (!from.mesh.userData.oldMaterial) from.mesh.userData.oldMaterial = from.mesh.material;
    from.mesh.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    setTimeout(() => {
      from.mesh.material = from.mesh.userData.oldMaterial;
    } , 300);
    //this.corruptedBlocks = this.corruptedBlocks.filter((corruptedBlock) => corruptedBlock != from);
    this.revertedBlocks.push(from);

    this.interval = setInterval(() => {

      let blocksReverted = 0;

      this.revertedBlocks.forEach((corruptedBlock) => {

        const adjancedBlocks = this.allBlocks.filter((block) => block.position.distanceTo(corruptedBlock.position) < 1.5);
        adjancedBlocks.forEach((block) => {

          if (!block.state.includes("reverted"))
            this.revertedBlocks.push(block);

          block.state += "reverted ";
          if (!block.mesh.userData.oldMaterial) block.mesh.userData.oldMaterial = block.mesh.material;
          block.mesh.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
          setTimeout(() => {
            block.mesh.material = block.mesh.userData.oldMaterial;
          } , 300);
          
            
          this.corruptedBlocks = this.corruptedBlocks.filter((corruptedBlock) => corruptedBlock != block);

          blocksReverted++;
        });

        this.revertedBlocks = this.revertedBlocks.filter((revertedBlock) => revertedBlock != corruptedBlock);
      });
    }, 77);
  }
}

export default CorruptionHandler;
