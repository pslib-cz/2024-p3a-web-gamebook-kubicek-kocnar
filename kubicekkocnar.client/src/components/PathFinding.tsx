import { PathFinder } from "../lib/PathFinding";
import PlacedBlock from "../types/PlacedBlock";
import * as THREE from 'three';


export function PathFinding({blocks, startBlock, endBlock} : {blocks : PlacedBlock[], startBlock : PlacedBlock, endBlock : PlacedBlock})
{
  const pathFinder = new PathFinder();

  startBlock.mesh.material = new THREE.MeshStandardMaterial({color: 0x00ff00});
  endBlock.mesh.material = new THREE.MeshStandardMaterial({color: 0xff0000});
  
  pathFinder.GetNeighbors(startBlock, blocks).forEach(neighbor => {
    neighbor.mesh.material = new THREE.MeshStandardMaterial({color: 0x0000ff});
  });

  pathFinder.FindPath(blocks, startBlock, endBlock).forEach(block => {
    block.mesh.material = new THREE.MeshStandardMaterial({color: 0xff00ff});
  });

  return null;  
}