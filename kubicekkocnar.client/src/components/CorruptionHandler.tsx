import { useContext, useEffect } from "react";
import * as THREE from "three";
import PlacedBlock from "../types/PlacedBlock";
import { AppContext } from "./AppContextProvider";

const ENEMY_SPAWN_CHANCE = 0.01;

export function CorruptionHandler({ allBlocks, corruptedBlocks }: { allBlocks: PlacedBlock[], corruptedBlocks: PlacedBlock[] }) {
  const { enemyHandler } = useContext(AppContext);

  useEffect(() => {

    const interval = setInterval(() => {
      corruptedBlocks.forEach((corruptedBlock) => {

        if (Math.random() < ENEMY_SPAWN_CHANCE) 
          enemyHandler?.spawnRandomEnemy();

        const adjancedBlocks = allBlocks.filter((block) => block.position.distanceTo(corruptedBlock.position) < 1.5);

        adjancedBlocks.forEach((block) => {
          if (block.state.includes("corrupt")) return;
          if (Math.random() > 0.2) return;

          block.state += "corrupt";

          if (block.mesh) {
            block.mesh.material = new THREE.MeshStandardMaterial({ color: 0xff00ff });
          }

          corruptedBlocks.push(block);
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
