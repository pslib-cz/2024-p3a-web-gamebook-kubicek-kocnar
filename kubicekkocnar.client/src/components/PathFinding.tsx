import { PathFinder } from "../lib/PathFinding";
import PlacedBlock from "../types/PlacedBlock";
import * as THREE from 'three';

export function PathFindingVisual({ blocks, startBlock, endBlock }: { blocks: PlacedBlock[], startBlock: PlacedBlock, endBlock: PlacedBlock }) {
  const pathFinder = new PathFinder(blocks);
  pathFinder.FindPathVisual(startBlock, endBlock);
  return null;
}

export function VisualizePathfinableBlocks({ blocks }: { blocks: PlacedBlock[] }) {
  const pathFinder = new PathFinder(blocks);

  for (const block of pathFinder.wakableBlocksDictionary.values())
  {
    block.mesh.material = new THREE.MeshStandardMaterial({color: 0x00ff00});
  }

  return null;
}

export function VisualizeBlocksNeighbours({ blocks, block }: { blocks: PlacedBlock[], block: PlacedBlock }) {
  const pathFinder = new PathFinder(blocks);

  for (const neighbour of pathFinder.GetNeighbors(block))
  {
    neighbour.mesh.material = new THREE.MeshStandardMaterial({color: 0x00ff00});
  }

  return null;
}