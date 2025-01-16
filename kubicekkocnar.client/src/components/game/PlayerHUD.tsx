import { useContext, useEffect, useMemo } from 'react';
import '../../styles/game/PlayerHUD.css';
import { AppContext } from '../AppContextProvider';
import { Coinage } from '../../types/Coinage';
import { CoinageDrawer } from '../CoinageDrawer';
import { GameContext } from '../../contexts/GameContext';
import { Joystick } from './Joystick';

const GameHUD = () => {
  // Example weapons data

  const { playerHealth } = useContext(GameContext);
  const { playerInventory } = useContext(AppContext);


  useEffect(() => {
    console.log("Player health changed to", playerHealth);
  }, [playerHealth]);

  // Calculate health bar color based on health value
  const getHealthColor = useMemo(() => {
    if (playerHealth > 70) return '#44ff44';
    if (playerHealth > 30) return '#ffae00';
    return '#ff4444';
  }, [playerHealth]);

  return (
    <div className="player-hud">
      <Joystick />
      <div>
        {
          playerInventory?.coinage.map((a: Coinage, x: number) => <CoinageDrawer key={x} coinage={a} count={playerInventory?.coinageAmount[x]} />)
        }
      </div>
      <div className="damage_overlay" style={{ opacity: playerHealth > 0 ? (0.5 - (Math.max(playerHealth, 0) / 200)) : 1 }}></div>
      <div className="crosshair">
        <div className="crosshair__dot"></div>
        <div className="crosshair__line crosshair__line--vertical crosshair__line--vertical-top"></div>
        <div className="crosshair__line crosshair__line--vertical crosshair__line--vertical-bottom"></div>
        <div className="crosshair__line crosshair__line--horizontal crosshair__line--horizontal-left"></div>
        <div className="crosshair__line crosshair__line--horizontal crosshair__line--horizontal-right"></div>
      </div>
      {/* Health Display */}
      <div className="player-hud__health-section">
        <div className="player-hud__health-bar-container">
          <div
            className="player-hud__health-bar"
            style={{
              width: `${playerHealth}%`,
              backgroundColor: getHealthColor
            }}
          />
        </div>
        <div className="player-hud__health-text">
          {playerHealth}
        </div>
      </div>

      {/* Weapons List */}
      <div className="player-hud__weapons-section">
        {playerInventory?.hotbar?.map((weapon, index) => (
          <div key={index} className={`player-hud__weapon-item ${playerInventory.selectedItemId == index ? "" : "player-hud__weapon-item--selected"}`}>
            <span className="player-hud__weapon-name">{weapon.img}</span>
            <span className="player-hud__weapon-ammo">{weapon.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHUD;