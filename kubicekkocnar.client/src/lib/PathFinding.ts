import * as THREE from "three";
import { Vector3 } from "three";
import PlacedBlock from "../types/PlacedBlock";

export class PathFinder
{
  public FindPath(blocks : PlacedBlock[], startBlock : PlacedBlock, endBlock : PlacedBlock): PlacedBlock[]
  {
    const queue = [startBlock];
    const visited = new Set<PlacedBlock>();
    const parentMap = new Map<PlacedBlock, PlacedBlock>(); // Maps each block to its parent block in the path

    visited.add(startBlock);

    while (queue.length > 0) {
      const currentBlock = queue.shift();

      if (currentBlock === endBlock) {
        // Path found, reconstruct the path
        let path = [];
        let step = endBlock;
        while (step !== startBlock) {
          path.push(step);
          step = parentMap.get(step);
        }
        path.push(startBlock);
        path.reverse();
        console.log("Path found:", path);
        return path;
      }

      // Get neighbors of the current block
      const neighbors = this.GetNeighbors(currentBlock, blocks);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parentMap.set(neighbor, currentBlock);
          queue.push(neighbor);
        }
      }
    }

    console.log("No path found");
    return [];
  }

  searchDirections = [
    new Vector3(1, 0, 0),
    new Vector3(-1, 0, 0),
    new Vector3(0, 0, 1),
    new Vector3(0, 0, -1)
  ];

  public GetNeighbors(block: PlacedBlock, blocks: PlacedBlock[]): PlacedBlock[] {

    const neighbors = [];

    for (const direction of this.searchDirections) {
      const neighborPosition = block.position.clone().add(direction);
      const neighbor = blocks.find(b => b.position.equals(neighborPosition));

      if (neighbor) neighbors.push(neighbor);
    }

    return neighbors;
  }
}