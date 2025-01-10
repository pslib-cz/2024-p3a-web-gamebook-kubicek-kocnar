import Game from "../types/Game";

const URL = `${import.meta.env.VITE_API_URL}/Games/`;

export async function FetchGames() : Promise<Game[]> {
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

    return [];
}

export async function PostGame(game : Game) : Promise<Game | null> {

    console.log("Posting game");

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

    return null;
}