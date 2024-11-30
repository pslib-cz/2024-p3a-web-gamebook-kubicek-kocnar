import Block from "./Block";
import Level from "./Level";

import { Mesh, Vector3 } from "three";

// a PlacedBlock is a block that has been placed in a level
// its directly rendered in the game

interface PlacedBlock {
    placedBlockId: number;

    blockId: number; // which Block is placed
    block: Block; // blockReference -> needs to be set on client from blockId

    levelId: number; // in which level is the block placed
    level: Level; // levelReference -> needs to be set on client from levelId

    mesh?: Mesh; // the rendered mesh of the block -> set when rendered

    position: Vector3; // where is it placed, needs conversion from [server] ...{x,y,z} to [client] Vector3

    state: string[]; // modifications to the default block attributes - either by playing the level or by the editor
} 

export default PlacedBlock;