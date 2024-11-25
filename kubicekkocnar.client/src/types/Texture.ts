interface BlockSideTexture {
    // id: string;
    name: string;
    url: string;
}

interface BlockTexture {
    // id: string;
    sides: BlockSideTexture[]; // 6 sides, order: top, bottom, left, right, front, back
}

export default BlockTexture;