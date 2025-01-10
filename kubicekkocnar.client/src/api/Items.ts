import { Item } from "../types/Item";


export async function GetItems() : Promise<Item[]> {

  try {
    const blocksResponse = await fetch('https://localhost:7097/api/Items');
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

    return (await blocksResponse.json());
      
  } catch (err: unknown) {
    console.error(err);
  }

  return [];
}


export async function DeleteItem(itemId : number) : Promise<void> {
  
    try {
      const blocksResponse = await fetch(`https://localhost:7097/api/Items/${itemId}`, {
        method: 'DELETE'
      });
      if (!blocksResponse.ok) {
        throw new Error(`Response status: ${blocksResponse.status}`);
      }
        
    } catch (err: unknown) {
      console.error(err);
    }
}

export async function PostItem(item : Item) : Promise<void> {
    
      try {
        const blocksResponse = await fetch(`https://localhost:7097/api/Items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        });
        if (!blocksResponse.ok) {
          throw new Error(`Response status: ${blocksResponse.status}`);
        }
          
      } catch (err: unknown) {
        console.error(err);
      }
  }