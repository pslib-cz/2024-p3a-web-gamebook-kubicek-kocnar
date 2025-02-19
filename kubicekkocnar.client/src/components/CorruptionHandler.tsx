import { useContext, useEffect } from "react";
import * as THREE from "three";
import PlacedBlock from "../types/PlacedBlock";
import { AppContext } from "./AppContextProvider";

export function CorruptionHandler({ allBlocks, corruptedBlocks }: { allBlocks: PlacedBlock[], corruptedBlocks: PlacedBlock[] }) {
  const { enemyHandler } = useContext(AppContext);

  const enemySpawnChance = 0.01;

  useEffect(() => {

    const interval = setInterval(() => {
      corruptedBlocks.forEach((corruptedBlock) => {

        if (Math.random() < enemySpawnChance) {
          enemyHandler?.spawnRandomEnemy();
        }

        const adjancedBlocks = allBlocks.filter((block) => block.position.distanceTo(corruptedBlock.position) < 1.5);
        adjancedBlocks.forEach((block) => {

          if (block.state.includes("corrupt")) return;

          if (Math.random() > 0.2) return;

          // if (!block.state) block.state = [];
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
