import React from 'react';
import { Link } from 'react-router-dom';

const MainMenu: React.FC = () => {
    return (
        <div>
            <h1>Main Menu</h1>
            <div>
                <Link to="/games/1/levels/1">
                    <button>Play</button>
                </Link>
            </div>
            <div>
                <Link to="/games">
                    <button>Browse Games</button>
                </Link>
            </div>
        </div>
    );
};

export default MainMenu;