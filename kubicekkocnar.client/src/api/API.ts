type objTypes = "Items" | "Blocks" | "Enemies" | "Coinages" | "Games" | "Levels" | "Textures" | "ItemUpgrades"

const URL: (obj: string) => string = (obj) => `${import.meta.env.VITE_API_URL}/${obj}`;

export async function GET(obj: objTypes): Promise<any> {
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
      method: 'DELETE'
    });
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

  } catch (err: unknown) {
    console.error(err);
  }
}

export async function POST(obj: objTypes, item: any): Promise<void> {
  try {
    const blocksResponse = await fetch(URL(obj), {
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

//patch JSONPatch replace
export async function PATCH(obj: objTypes, itemId: number, key: string, value: any): Promise<void> {

  try {
    const blocksResponse = await fetch(`${URL(obj)}/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
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