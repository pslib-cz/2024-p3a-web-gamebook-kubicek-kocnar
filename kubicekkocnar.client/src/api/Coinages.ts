import { Coinage } from "../types/Coinage";

const URL : string = `${import.meta.env.VITE_API_URL}/Coinages`;

export async function GetCoinages() : Promise<Coinage[]> {

  try {
      const blocksResponse = await fetch(URL);
      if (!blocksResponse.ok) {
        throw new Error(`Response status: ${blocksResponse.status}`);
      }

      return (await blocksResponse.json());
      
  } catch (err: unknown) {
    console.error(err);
  }

  return [];
}

export async function DeleteCoinage(coinageId : number) : Promise<void> {
  
  try {
    const blocksResponse = await fetch(`${URL}/${coinageId}`, {
      method: 'DELETE'
    });
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }
      
  } catch (err: unknown) {
    console.error(err);
  }
}

export async function PostCoinage(coinage : Coinage) : Promise<void> {
    
  try {
    const blocksResponse = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(coinage)
    });
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }
      
  } catch (err: unknown) {
    console.error(err);
  }
}
