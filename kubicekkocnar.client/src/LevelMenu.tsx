import { useEffect, useState } from "react";
import Level from "./types/Level";
import { useForm } from "react-hook-form";

export function LevelMenu()
{
	const endpoint = 'https://localhost:7097/api/Games/1/Levels';

	const [levels_, setLevels] = useState<Level[]>();

	async function fetchLevels() {
		try {
			const response = await fetch(endpoint);
			if (!response.ok) {
					throw new Error('Network response was not ok');
			}
			const levels: Level[] = await response.json();
			setLevels(levels);
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
		}
	}

	useEffect(() => {
		fetchLevels();
	}, [])

  const {register, getValues} = useForm();
  
	async function PostLevel(level : Level) {

    console.log("Posting level");

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(level)
			});
			if (!response.ok) {
					throw new Error('Network response was not ok');
			}
			const levels: Level[] = await response.json();
			setLevels(levels);
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
		}
  }

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
                  } as Level
                );
              }
            }
          >
            Create new Level
          </button>
        </form>
			</div>

			<div>
				{levels_ && levels_?.length != 0 &&
          levels_.map(level => LevelDisplayer(level))
				}
			</div>
		</div>
	)
}

function LevelDisplayer(level : Level)
{
    return (
      <div key={level.levelId}>
        <h2>{level.name}</h2>
        <p>{level.description}</p>
      </div>
    )
}