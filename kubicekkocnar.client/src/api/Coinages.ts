import { Coinage } from "../types/Coinage";

export async function GetCoinages() : Promise<Coinage[]> {

  try {
      const blocksResponse = await fetch('https://localhost:7097/api/Coinages');
      if (!blocksResponse.ok) {
        throw new Error(`Response status: ${blocksResponse.status}`);
      }

      const coinage = (await blocksResponse.json());

      return coinage;
      
  } catch (err: unknown) {
    console.error(err);
  }

  return [];
}
