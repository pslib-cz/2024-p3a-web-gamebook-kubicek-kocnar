import { ItemUpgrade } from "../types/ItemUpgrade";
import { GET, DELETE, POST } from "./API";

export async function GetUpgrades(): Promise<ItemUpgrade[]> {
  return await GET("ItemUpgrades") as ItemUpgrade[];
}

export async function DeleteUpgrade(upgradeId: number): Promise<void> {
  return await DELETE("ItemUpgrades", upgradeId);
}

export async function PostUpgrade(upgrade: ItemUpgrade): Promise<void> {
  return await POST("ItemUpgrades", upgrade);
}