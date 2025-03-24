import SaveHandler from "../lib/SaveHandler";
import { apiURL } from "../env";

export type objTypes = "Items" | "Blocks" | "Enemies" | "Coinages" | "Games" | "Games/1/Levels" | "Textures" | "ItemUpgrades"

const URL: (obj: string) => string = (obj) => `${apiURL}/${obj}`;

export async function GET(obj: objTypes): Promise<unknown> {
  try {
    const blocksResponse = await fetch(URL(obj));
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

    return (await blocksResponse.json());

  } catch (err: unknown) {
    console.error(err);
  }

  return [];
}

export async function DELETE(obj: objTypes, itemId: number): Promise<void> {
  try {
    const blocksResponse = await fetch(`${URL(obj)}/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
      }
    });
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

  } catch (err: unknown) {
    console.error(err);
  }
}

export async function POST(obj: objTypes, item: unknown): Promise<void> {
  try {
    const blocksResponse = await fetch(URL(obj), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
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

//patch JSONPatch replace
export async function PATCH(obj: objTypes, itemId: number, key: string, value: unknown): Promise<void> {

  try {
    const blocksResponse = await fetch(`${URL(obj)}/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await SaveHandler.getAuth())?.accessToken}`
      },
      body: JSON.stringify([{
        "op": "replace",
        "path": "/" + key,
        "value": value
      }])
    });
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

  } catch (err: unknown) {
    console.error(err);
  }
}
//patch JSONPatch add