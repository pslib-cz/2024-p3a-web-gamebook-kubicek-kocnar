import Level from "../types/Level";

function URL(gameid : number) : string { return `${import.meta.env.VITE_API_URL}/Games/${gameid}/Levels`;}

export async function FetchLevels(gameid : number) : Promise<Level[]> {
    try {
        const response = await fetch(URL(gameid));
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

    return [];
}

export async function FetchLevel(gameid : number, levelid : number) : Promise<Level | null> {
    try {
        const response = await fetch(`${URL(gameid)}/${levelid}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

    return null;
}

export async function PostLevel(level : Level, gameid : number) : Promise<Level | null>{
    try {
        const response = await fetch(URL(gameid), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(level)
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