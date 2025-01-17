import { Enemy } from "../lib/Enemy";

const URL = `${import.meta.env.VITE_API_URL}/Enemies`;

export async function FetchEnemies() : Promise<Enemy[]> {
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