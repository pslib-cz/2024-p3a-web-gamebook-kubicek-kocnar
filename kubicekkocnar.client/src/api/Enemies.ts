import { EnemyType } from "../types/Enemy";
import { DELETE, GET, POST } from "./API";

export async function FetchEnemies(): Promise<EnemyType[]> {
  return await GET("Enemies") as EnemyType[];
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
  return await POST("Enemies", enemy);
}

export async function DeleteEnemy(enemyId: number): Promise<void> {
  return await DELETE("Enemies", enemyId);
}