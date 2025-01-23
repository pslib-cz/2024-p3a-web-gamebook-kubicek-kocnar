import { EnemyType } from "../types/Enemy";

const URL = `${import.meta.env.VITE_API_URL}/Enemies`;

export async function FetchEnemies() : Promise<EnemyType[]> {
  try {
    const enemiesResponse = await fetch(URL);
    if (!enemiesResponse.ok) {
      throw new Error(`Response status: ${enemiesResponse.status}`);
    }
    
    return (await enemiesResponse.json());
      
  } catch (err: unknown) {
    console.error(err);
  }

  return [];
}

export async function AddEnemy(enemy: EnemyType) {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enemy)
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (err: unknown) {
    console.error(err);
  }
}
