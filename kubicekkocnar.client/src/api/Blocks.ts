import Block from "../types/Block";
import { POST } from "./API";
import { apiURL } from "../env";

const URL = `${apiURL}/Blocks`;

export async function FetchBlocks(): Promise<Block[]> {
  try {
    const blocksResponse = await fetch(URL);
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

    return (await blocksResponse.json()).map((block: { attributes: string }) => {
      return {
        ...block,
        attributes: block.attributes.split(',')
      }
    })

  } catch (err: unknown) {
    console.error(err);
  }

  return [];
}

export async function addBlock(block: Block) {
  return await POST("Blocks", block);
}
