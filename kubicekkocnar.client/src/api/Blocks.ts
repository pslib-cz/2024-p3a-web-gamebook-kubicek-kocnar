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