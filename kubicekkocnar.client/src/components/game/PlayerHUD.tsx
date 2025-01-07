import { useMemo, useState } from 'react';
import '../../styles/game/PlayerHUD.css';

const GameHUD = () => {
  // Example weapons data
  const weapons = [
    { name: "PRIMARY", ammo: "30/120" },
    { name: "SECONDARY", ammo: "15/45" },
    { name: "GADGET", ammo: "2/2" }
  ];

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
        {weapons.map((weapon, index) => (
          <div key={index} className="player-hud__weapon-item">
            <span className="player-hud__weapon-name">{weapon.name}</span>
            <span className="player-hud__weapon-ammo">{weapon.ammo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHUD;