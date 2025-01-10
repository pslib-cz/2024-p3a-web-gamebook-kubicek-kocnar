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

export async function DeleteUpgrade(upgradeId : number) : Promise<void> {
  
    try {
      const blocksResponse = await fetch(`https://localhost:7097/api/ItemUpgrades/${upgradeId}`, {
        method: 'DELETE'
      });
      if (!blocksResponse.ok) {
        throw new Error(`Response status: ${blocksResponse.status}`);
      }
        
    } catch (err: unknown) {
      console.error(err);
    }
}

export async function PostUpgrade(upgrade : ItemUpgrade) : Promise<void> {
    
      try {
        const blocksResponse = await fetch(`https://localhost:7097/api/ItemUpgrades`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(upgrade)
        });
        if (!blocksResponse.ok) {
          throw new Error(`Response status: ${blocksResponse.status}`);
        }
          
      } catch (err: unknown) {
        console.error(err);
      }
  }