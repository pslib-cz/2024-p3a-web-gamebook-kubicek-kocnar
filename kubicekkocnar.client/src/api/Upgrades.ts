import { ItemUpgrade } from "../types/ItemUpgrade";
import { GET, DELETE, POST } from "./API";

// const URL: string = `${import.meta.env.VITE_API_URL}/ItemUpgrades`;

export async function GetUpgrades(): Promise<ItemUpgrade[]> {
  return await GET("ItemUpgrades") as ItemUpgrade[];
}

export async function DeleteUpgrade(upgradeId: number): Promise<void> {
  return await DELETE("ItemUpgrades", upgradeId);
}

export async function PostUpgrade(upgrade: ItemUpgrade): Promise<void> {

  return await POST("ItemUpgrades", upgrade);

  // try {
  //   const blocksResponse = await fetch(URL, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(upgrade)
  //   });
  //   if (!blocksResponse.ok) {
  //     throw new Error(`Response status: ${blocksResponse.status}`);
  //   }

  // } catch (err: unknown) {
  //   console.error(err);
  // }
}