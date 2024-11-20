import BlockTexture from "./Texture";

interface Block {
    blockId: number;
    position: [number, number, number];
    texture?: BlockTexture
}

export default Block;
