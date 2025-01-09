import { ItemUpgrade } from "../types/ItemUpgrade";


export async function GetUpgrades() : Promise<ItemUpgrade[]> {  

  try {
    const blocksResponse = await fetch('https://localhost:7097/api/ItemUpgrades');
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }
    const upgrades = (await blocksResponse.json());

    return upgrades;

  } catch (err: unknown) {
    console.error(err);
  }
  
  return [];
}