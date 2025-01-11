import Block from "../types/Block";

const URL = `${import.meta.env.VITE_API_URL}/Blocks`;

export async function FetchBlocks() : Promise<Block[]> {
  try {
    const blocksResponse = await fetch(URL);
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }
    
    return (await blocksResponse.json()).map((block: {attributes: string}) =>
    {
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
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(block)
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (err: unknown) {
    console.error(err);
  }
}
