import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/index.css"
import SaveHandler from '../lib/SaveHandler';

const MainMenu: React.FC = () => {

  const save = SaveHandler.loadPlayer();

  return (
    <div className='mainmenu'>
      <div className="mainmenu__headings">
        <h3 className='mainmenu__subheading'>fr rpg</h3>
        <h1 className='mainmenu__heading'>corrupted</h1>
      </div>
      <div className="mainmenu__buttons">
        <Link className='button' to="/games/1/levels/1">
          Play
        </Link>
        <Link className={"button " + save ? "" : "mainmenu__disabled"} to={`/games/${save?.game}/levels/${save?.level}`}>
          Continue
        </Link>
        <Link className='button' to="/games">
          Browse Games
        </Link>
      </div>
      <div className="mainmenu__footer mainmenu__semi">
        <p>TOMAS KUBICEK</p>
        <p>JAN KOCNAR</p>
      </div>
      <div className="mainmenu__thanksto">
        <p>Special thanks to: Filip Hudec</p>
      </div>
    </div>
  );
};

export default MainMenu;