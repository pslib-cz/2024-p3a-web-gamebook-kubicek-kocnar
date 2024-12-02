import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Game from "./types/Game";
import { Link } from "react-router-dom";

export function GamesMenu()
{
	const GAMESROUTE = 'https://localhost:7097/api/Games/';

	const [games, setGames] = useState<Game[]>();

	async function fetchGames() {
		try {
			const response = await fetch(GAMESROUTE);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const games: Game[] = await response.json();
			setGames(games);
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
		}
	}

	useEffect(() => {
		fetchGames();
	}, [])

  const {register, getValues} = useForm();
  
	async function PostGame(game : Game) {

    console.log("Posting game");

		try {
			const response = await fetch(GAMESROUTE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(game)
			});
			if (!response.ok) {
					throw new Error('Network response was not ok');
			}
			const games: Game[] = await response.json();
			setGames(games);
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
		}
  }

	return (
		<div>
			<div>
				<h2>New Game</h2>
        <form>
          <input {...register("game.name")}></input>
          <button
            onClick={(e) =>
              {
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
				{games && games?.length != 0 &&
          games.map(game => GameDisplayer(game))
				}
			</div>
		</div>
	)
}

function GameDisplayer(game : Game)
{
    return (
      <Link className="game" key={game.gameId} to={`/games/${game.gameId}/levels`}>
        <h2>{game.name}</h2>
        <p>{game.description}</p>
		<p>{game.author?.username}</p>
		{/* <Link className="button" to={`/games/${game.gameId}/levels`}>Zobrazit</Link> */}
      </Link>
    )
}