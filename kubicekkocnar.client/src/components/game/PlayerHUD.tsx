import { useContext, useEffect, useMemo, useState } from 'react';
import '../../styles/game/PlayerHUD.css';
import { AppContext } from '../AppContextProvider';
import { color } from 'three/webgpu';

const GameHUD = () => {
  // Example weapons data

  const { playerInventory } = useContext(AppContext);

  const [health] = useState(75); // Example health value

  // Calculate health bar color based on health value
  const getHealthColor = useMemo(() => {
    if (health > 70) return '#44ff44';
    if (health > 30) return '#ffae00';
    return '#ff4444';
  }, [health]);

  return (
    <div className="player-hud">
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
              width: `${health}%`,
              backgroundColor: getHealthColor
            }}
          />
        </div>
        <div className="player-hud__health-text">
          {health}
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