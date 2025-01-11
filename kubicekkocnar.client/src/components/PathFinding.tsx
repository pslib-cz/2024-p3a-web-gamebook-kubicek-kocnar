import { PathFinder } from "../lib/PathFinding";
import PlacedBlock from "../types/PlacedBlock";


export function PathFindingVisual({blocks, startBlock, endBlock} : {blocks : PlacedBlock[], startBlock : PlacedBlock, endBlock : PlacedBlock})
{
  const pathFinder = new PathFinder();

  pathFinder.FindPathVisual(blocks, startBlock, endBlock);

  return null;
}