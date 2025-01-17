import { Material } from 'three';

// a Block is a type referenced in the PlacedBlock type
// used to define the properties of a rendered block in the game
interface Block {
    blockId: number;
    name: string;

    attributes: string[]; //works like classes in HTML -> needs conversion from [server] string to [client] string[]
    
    material?: Material | Material[]; // asigned once the first block of this type is added to the scene

    texture0Id: number; // when only texture0 is set, it is used for all sides 
    texture1Id: number;
    texture2Id: number;
    texture3Id: number;
    texture4Id: number;
    texture5Id: number; // when texture5 is set, all textures are used for each side

    created: Date;
}

export default Block;
