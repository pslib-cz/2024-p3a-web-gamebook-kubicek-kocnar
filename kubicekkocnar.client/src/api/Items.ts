import { Item } from "../types/Item";
import { GET } from "./API";

const URL: string = `${import.meta.env.VITE_API_URL}/Items`;

export async function GetItems(): Promise<Item[]> {

  return await GET("Items");
}


export async function DeleteItem(itemId: number): Promise<void> {

  try {
    const blocksResponse = await fetch(`${URL}/${itemId}`, {
      method: 'DELETE'
    });
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

  } catch (err: unknown) {
    console.error(err);
  }
}

export async function PostItem(item: Item): Promise<void> {

  try {
    const blocksResponse = await fetch(URL, {
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