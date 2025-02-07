import { EnemyType } from "../types/Enemy";
import { GET } from "./API";

const URL = `${import.meta.env.VITE_API_URL}/Enemies`;

export async function FetchEnemies(): Promise<EnemyType[]> {
  return await GET("Enemies");
}

export async function FetchLevelEnemies(gameId: number, levelId: number): Promise<EnemyType[]> {

  try {
    const blocksResponse = await fetch(`${import.meta.env.VITE_API_URL}/Games/${gameId}/Levels/${levelId}/Enemies`);
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

    return (await blocksResponse.json());

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

export async function DeleteEnemy(enemyId: number): Promise<void> {

  try {
    const blocksResponse = await fetch(`${URL}/${enemyId}`, {
      method: 'DELETE'
    });
    if (!blocksResponse.ok) {
      throw new Error(`Response status: ${blocksResponse.status}`);
    }

  } catch (err: unknown) {
    console.error(err);
  }
}