import { Item } from "../types/Item";
import { GET, DELETE, POST } from "./API";

// const URL: string = `${import.meta.env.VITE_API_URL}/Items`;

export async function GetItems(): Promise<Item[]> {
  return await GET("Items") as Item[];
}

export async function DeleteItem(itemId: number): Promise<void> {
  return await DELETE("Items", itemId);
}

export async function PostItem(item: Item): Promise<void> {

  return await POST("Items", item);

  // try {
  //   const blocksResponse = await fetch(URL, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(item)
  //   });
  //   if (!blocksResponse.ok) {
  //     throw new Error(`Response status: ${blocksResponse.status}`);
  //   }

  // } catch (err: unknown) {
  //   console.error(err);
  // }
}