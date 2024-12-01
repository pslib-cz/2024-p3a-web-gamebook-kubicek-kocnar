import PlacedBlock from "./PlacedBlock"
import Game from "./Game"

// a Level is a part of a game, which can be played and contains all blocks which are currently rendered
interface Level
{
  levelId: number,
  name: string,
  description?: string,
  nextLevel?: number,

  gameId: number,
  game?: Game; // gameReference -> needs to be set on client from gameId

  blocks: PlacedBlock[]

  created: Date;
}

export default Level