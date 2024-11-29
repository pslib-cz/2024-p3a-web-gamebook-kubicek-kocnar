import Block from "./Block"

interface Level
{
  levelId: number,
  name: string,
  description: string,
  nextLevel: number,
  blocks: Block[]
}

export default Level