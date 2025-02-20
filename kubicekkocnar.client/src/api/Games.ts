import Game from "../types/Game";
import { GET, POST } from "./API";

export async function FetchGames(): Promise<Game[]> {
  return await GET("Games") as Game[];
}

export async function PostGame(game: Game) {
  return await POST("Games", game);
}