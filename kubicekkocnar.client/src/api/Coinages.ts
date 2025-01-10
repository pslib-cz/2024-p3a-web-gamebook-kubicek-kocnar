import { Coinage } from "../types/Coinage";

export async function GetCoinages() : Promise<Coinage[]> {

  try {
      const blocksResponse = await fetch('https://localhost:7097/api/Coinages');
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
    const blocksResponse = await fetch(`https://localhost:7097/api/Coinages/${coinageId}`, {
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
    const blocksResponse = await fetch(`https://localhost:7097/api/Coinages`, {
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
