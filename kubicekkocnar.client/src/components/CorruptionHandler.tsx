import { useContext, useEffect } from "react";
import * as THREE from "three";
import PlacedBlock from "../types/PlacedBlock";
import {AppContext} from "./AppContextProvider";
import { defaultEnemyType } from "../lib/Enemy";

export function CorruptionHandler({allBlocks, corruptedBlocks} : {allBlocks : PlacedBlock[], corruptedBlocks : PlacedBlock[]})
{
  const { enemyHandler } = useContext(AppContext);
  
  const enemySpawnChance = 0.01;

  useEffect(() => {

    const interval = setInterval(() => {
      
      // for each corrupted block, corrupt the adjanced blocks
      corruptedBlocks.forEach((corruptedBlock) => {

        if (Math.random() < enemySpawnChance) {
          console.log("Spawning enemy");
          
          enemyHandler.addEnemy(defaultEnemyType);
        }

        const adjancedBlocks = allBlocks.filter((block) => block.position.distanceTo(corruptedBlock.position) < 1.5);
        adjancedBlocks.forEach((block) => {

          if (block.state.includes("corrupt")) return;

          if (Math.random() > 0.2) return;
          
          if (!block.state) block.state = [];
          block.state.push("corrupt");

          // update the mesh
          if (block.mesh) {
            // change color to pink
            block.mesh.material = new THREE.MeshStandardMaterial({color: 0xff00ff});
          }
          
          corruptedBlocks.push(block);

          //console.log("Corrupted block", block);
        });
      });

      //console.log("Corrupted blocks", corruptedBlocks);

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
