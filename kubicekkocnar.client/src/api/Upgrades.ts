import { ItemUpgrade } from "../types/ItemUpgrade";
import { GET } from "./API";

const URL: string = `${import.meta.env.VITE_API_URL}/ItemUpgrades`;

export async function GetUpgrades(): Promise<ItemUpgrade[]> {

  return GET("ItemUpgrades");
}

export async function DeleteUpgrade(upgradeId: number): Promise<void> {

  try {
    const blocksResponse = await fetch(`${URL}/${upgradeId}`, {
      method: 'DELETE'
    });
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

  } catch (err: unknown) {
    console.error(err);
  }
}

export async function PostUpgrade(upgrade: ItemUpgrade): Promise<void> {

  try {
    const blocksResponse = await fetch(URL, {
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