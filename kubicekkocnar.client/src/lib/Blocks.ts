import { FetchBlocks } from '../api/Blocks';
import Block from '../types/Block';

class Blocks {
  blocks: Block[];
  constructor(onReady: (blocks: Blocks) => void) {
    this.blocks = [];
    this.initializeServerBlocks(onReady);
  }
  async initializeServerBlocks(onReady: (blocks: Blocks) => void) {
    try {
      this.blocks = await FetchBlocks();
      onReady(this);
    } catch (err: unknown) {
      console.error(err);
    }
  }
}

export default Blocks;