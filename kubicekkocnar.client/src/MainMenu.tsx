import React from 'react';
import { Link } from 'react-router-dom';

const MainMenu: React.FC = () => {
    return (
        <div>
            <h1>Main Menu</h1>
            <div>
                <Link className='button' to="/games/1/levels/1">
                Play
                </Link>
            </div>
            <div>
                <Link className='button' to="/games">
                    Browse Games
                </Link>
            </div>
        </div>
    );
};

export default MainMenu;