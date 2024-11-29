import Block from "./Block"

export interface Level
{
  levelId: number,
  name: string,
  description: string
  blocks: Block[]
}