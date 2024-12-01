import Block from '../types/Block';

class Blocks {
    blocks: Block[];
    constructor(onReady: (blocks: Blocks) => void) {
        this.blocks = [];
        this.initializeServerBlocks(onReady);
    }
    async initializeServerBlocks(onReady: (blocks: Blocks) => void) {
        try {
            const blocksResponse = await fetch('https://localhost:7097/api/Blocks');
            if (!blocksResponse.ok) {
                throw new Error(`Response status: ${blocksResponse.status}`);
            }
            this.blocks = (await blocksResponse.json()).map((block: {attributes: string}) =>
            {
                return {
                    ...block,
                    attributes: block.attributes.split(',')
                }
            })
            console.log(this.blocks);
            
            onReady(this);
        } catch (err: unknown) {
            console.error(err);
        }
    }
    
}

export default Blocks;