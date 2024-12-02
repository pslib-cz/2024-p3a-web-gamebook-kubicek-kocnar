import Texture from "./Texture";
import { Material } from 'three';

// a Block is a type referenced in the PlacedBlock type
// used to define the properties of a rendered block in the game
interface Block {
    blockId: number;
    name: string;

    attributes: string[]; //works like classes in HTML -> needs conversion from [server] string to [client] string[]
    
    material?: Material | Material[]; // asigned once the first block of this type is added to the scene

    texture0?: Texture; // when only texture0 is set, it is used for all sides 
    texture1?: Texture;
    texture2?: Texture;
    texture3?: Texture;
    texture4?: Texture;
    texture5?: Texture; // when texture5 is set, all textures are used for each side

    created: Date;
}

export default Block;
