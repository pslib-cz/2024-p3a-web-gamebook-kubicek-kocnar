import { Item } from "../types/Item";
import { GET, DELETE, POST } from "./API";

export async function GetItems(): Promise<Item[]> {
  return await GET("Items") as Item[];
}

export async function DeleteItem(itemId: number): Promise<void> {
  return await DELETE("Items", itemId);
}

export async function PostItem(item: Item): Promise<void> {
  return await POST("Items", item);
}