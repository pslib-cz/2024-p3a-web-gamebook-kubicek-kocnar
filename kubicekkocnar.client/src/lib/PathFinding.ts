import * as THREE from "three";
import { Vector3 } from "three";
import PlacedBlock from "../types/PlacedBlock";

export class PathFinder
{
  searchDirections = [
    new Vector3(1, 0, 0),
    new Vector3(-1, 0, 0),
    new Vector3(0, 0, 1),
    new Vector3(0, 0, -1),

    new Vector3(1, 1, 0),
    new Vector3(-1, 1, 0),
    new Vector3(0, 1, 1),
    new Vector3(0, 1, -1),

    new Vector3(1, -1, 0),
    new Vector3(-1, -1, 0),
    new Vector3(0, -1, 1),
    new Vector3(0, -1, -1),

    new Vector3(1, -2, 0),
    new Vector3(-1, -2, 0),
    new Vector3(0, -2, 1),
    new Vector3(0, -2, -1),

    new Vector3(1, -3, 0),
    new Vector3(-1, -3, 0),
    new Vector3(0, -3, 1),
    new Vector3(0, -3, -1),

    new Vector3(1, -4, 0),
    new Vector3(-1, -4, 0),
    new Vector3(0, -4, 1),
    new Vector3(0, -4, -1),
    
    new Vector3(1, -5, 0),
    new Vector3(-1, -5, 0),
    new Vector3(0, -5, 1),
    new Vector3(0, -5, -1),
  ];
  
  heightChecks = [
    new Vector3(0, 1, 0),
    new Vector3(0, 2, 0)
  ]

  // string conversion is necessary
  public wakableBlocksDictionary: Map<string, PlacedBlock>;
  public allBlockDictionary: Map<string, PlacedBlock>; // all blocks

  constructor (blocks : PlacedBlock[])
  {
    this.wakableBlocksDictionary = new Map<string, PlacedBlock>();
    this.allBlockDictionary = new Map<string, PlacedBlock>();

    for (const block of blocks)
    {
      this.allBlockDictionary.set(block.position.toArray().toString(), block);
    }
    
    for (const block of blocks)
    {
      if (!this.IsBlockWalkable(block)) continue;
      this.wakableBlocksDictionary.set(block.position.toArray().toString(), block);
    }
  }

  public FindPathVisual(startBlock : PlacedBlock, endBlock : PlacedBlock): void
  {
    if (!startBlock || !endBlock) {
      console.error("Start or end block not found");
      return;
    }

    const queue = [startBlock];
    const visited = new Set<PlacedBlock>();
    const parentMap = new Map<PlacedBlock, PlacedBlock>(); // Maps each block to its parent block in the path

    console.log("Start pathfinding", this.wakableBlocksDictionary);

    visited.add(startBlock);

    startBlock.mesh.material = new THREE.MeshStandardMaterial({color: 0x00ff00});
    endBlock.mesh.material = new THREE.MeshStandardMaterial({color: 0xff0000});

    // create coroutine to visualize the pathfinding
    const visualizePathFinding = async () => {
      while (queue.length > 0) {
        const currentBlock = queue.shift();

        if (currentBlock === endBlock) {
          // Path found, reconstruct the path
          const path = [];
          let step : PlacedBlock = endBlock;
          while (step !== startBlock) {
            path.push(step);
            step = parentMap.get(step)!;
          }
          path.push(startBlock);
          path.reverse();
          console.log("Path found:", path);

          for (const block of path) {
            block.mesh.material = new THREE.MeshStandardMaterial({color: 0x00ff00});
          }

          return path;
        }

        // Get neighbors of the current block
        const neighbors = this.GetNeighbors(currentBlock!);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);

            parentMap.set(neighbor, currentBlock!);
            queue.push(neighbor);            

            neighbor.mesh!.material = new THREE.MeshStandardMaterial({color: 0x0000ff});
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      console.warn("No path found");
      return [];
    }

    visualizePathFinding();
  }

  public FindPath(startBlock : PlacedBlock, endBlock : PlacedBlock): PlacedBlock[]
  {
    if (!startBlock || !endBlock) {
      console.error("Start or end block not found");
      return [];
    }

    const queue = [startBlock];
    const visited = new Set<PlacedBlock>();
    const parentMap = new Map<PlacedBlock, PlacedBlock>(); // Maps each block to its parent block in the path

    visited.add(startBlock);

    while (queue.length > 0) {
      const currentBlock = queue.shift()!;

      if (currentBlock === endBlock) {
        const path = [];
        let step = endBlock;

        while (step !== startBlock) {
          path.push(step);
          step = parentMap.get(step)!;
        }

        path.push(startBlock);
        path.reverse();
        
        return path;
      }

      // Get neighbors of the current block
      const neighbors = this.GetNeighbors(currentBlock);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parentMap.set(neighbor, currentBlock);
          queue.push(neighbor);
        }
      }
    }
    return [];
  }

  public GetNeighbors(block: PlacedBlock): PlacedBlock[] {

    const neighbors = [];

    for (const direction of this.searchDirections) {
      const neighborPosition = block.position.clone().add(direction);
      
      const neighbor = this.wakableBlocksDictionary.get(neighborPosition.toArray().toString());

      if (neighbor) neighbors.push(neighbor);
    }

    return neighbors;
  }

  private IsBlockWalkable(block: PlacedBlock): boolean {    
    for (const direction of this.heightChecks) {
      const abovePosition = block.position.clone().add(direction);
      const aboveBlock = this.allBlockDictionary.get(abovePosition.toArray().toString());

      if (aboveBlock) return false;
    }

    return true;    
  }

  public GetClosestBlock(position: Vector3): PlacedBlock | null {
    let closestBlock: PlacedBlock | null = null;
    let minDistance = Infinity;

    for (const block of this.wakableBlocksDictionary.values()) {
      const distance = block.position.distanceTo(position);
      if (distance < minDistance) {
        minDistance = distance;
        closestBlock = block;
      }
    }

    return closestBlock;
  }
}