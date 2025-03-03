import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import Game from "../../types/Game";
import { FetchGames, PostGame } from "../../api/Games";

export default function GamesMenu() {
  const [games, setGames] = useState<Game[]>();

  useEffect(() => {
    const fetchData = async () => {
      setGames(await FetchGames());
    };
    fetchData();
  }, [])

  const { register, getValues } = useForm();

  return (
    <div>
      <div>
        <h2>New Game</h2>
        <form>
          <input {...register("game.name")}></input>
          <button
            onClick={(e) => {
              e.preventDefault()
              PostGame(
                {
                  name: getValues('game.name')
                } as Game
              );
            }
            }
          >
            Create new Game
          </button>
        </form>
      </div>

      <div className="games">
        {games && games?.length != 0 ?
          games.map(game => GameDisplayer(game)) :
          <div className="loader"></div>
        }
      </div>
    </div>
  )
}

function GameDisplayer(game: Game) {
  return (
    <Link className="game" key={game.gameId} to={`/games/${game.gameId}/levels`}>
      <h2>{game.name}</h2>
      <p>{game.description}</p>
      <p>{game.author?.username}</p>
      {/* <Link className="button" to={`/games/${game.gameId}/levels`}>Zobrazit</Link> */}
    </Link>
  )
}