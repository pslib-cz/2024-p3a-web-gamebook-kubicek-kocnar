import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import Level from "../../../../types/Level";
import { FetchLevels, PostLevel } from "../../../../api/Levels";

export default function LevelMenu()
{
	const { gameid } = useParams();

	const [levels_, setLevels] = useState<Level[]>();

	useEffect(() => {
		const fetchLevels = async () => {
			setLevels(await FetchLevels(Number(gameid!)));
		};
		fetchLevels();
	}, [gameid]);

  const {register, getValues} = useForm();

	return (
		<div>
			<div>
				<h2>New Level</h2>
				<form>
					<input {...register("level.name")}></input>
					<button
						onClick={(e) =>
						{
							e.preventDefault()
							PostLevel(
							{
								name: getValues('level.name')
							} as Level, Number(gameid!)
							);
						}
						}
					>
						Create new Level
					</button>
				</form>
			</div>
			<div className="games">
				{levels_ && levels_?.length != 0 ?
          			levels_.map(level => LevelDisplayer(level)) :
					  <div className="loader"></div>
				}
			</div>
		</div>
	)
}

function LevelDisplayer(level : Level)
{
    return (
      <Link key={level.levelId} className="game" to={`/games/${level.gameId}/levels/${level.levelId}`}>
        <h2>{level.levelId}</h2>
		<p>{level.name}</p>
        <p>{level.description}</p>
      </Link>
    )
}