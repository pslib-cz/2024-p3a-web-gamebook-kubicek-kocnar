import Level from './Level';
import User from './User';


// a Game is a collection of levels
// the default game has ID=1, users can create their own games, which will be visible in the game list menu (if published)
interface Game {
    gameId: number;
    
    name: string;
    description: string;

    published: boolean; // if true, the game is visible in the game list menu

    levels: Level[];

    authorId: number; // the user who created the game
    author: User; 

    created: Date;
}

export default Game;