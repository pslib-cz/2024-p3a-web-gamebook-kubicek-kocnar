import { useContext, useMemo } from 'react';
import '../../styles/game/PlayerHUD.css';
import { AppContext } from '../AppContextProvider';
import { Coinage } from '../../types/Coinage';
import { CoinageDrawer } from '../CoinageDrawer';
import { GameContext } from '../../contexts/GameContext';
import { Joystick } from './Joystick';

const GameHUD = () => {
  const { playerHealth } = useContext(GameContext);
  const { player } = useContext(AppContext);

  // Calculate health bar color based on health value
  const getHealthColor = useMemo(() => {
    if ((player?.health ?? 0) > 70) return '#44ff44';
    if ((player?.health ?? 0) > 30) return '#ffae00';
    return '#ff4444';
  }, [player]);

  const HealthBar = () => {
    return (
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
    )
  }

  const DamageOverlay = () => <div className="damage_overlay" style={{ opacity: playerHealth > 0 ? (0.5 - (Math.max(playerHealth, 0) / 200)) : 1 }}></div>

  const Crosshair = () => (
    <div className="crosshair">
      <div className="crosshair__dot"></div>
      <div className="crosshair__line crosshair__line--vertical crosshair__line--vertical-top"></div>
      <div className="crosshair__line crosshair__line--vertical crosshair__line--vertical-bottom"></div>
      <div className="crosshair__line crosshair__line--horizontal crosshair__line--horizontal-left"></div>
      <div className="crosshair__line crosshair__line--horizontal crosshair__line--horizontal-right"></div>
    </div>
  )

  if (playerHealth <= 0) {
    return (
      <>
        <DamageOverlay />
        <div className="death-overlay" style={{ right: "50%", top: "50%", backgroundColor: "black" }}>
          <p>Ya ded</p>
          <a href="/">Restart</a>
        </div>
      </>
    )
  }

  return (
    <div className="player-hud">
      <Joystick />
      <div>
        {
          player?.inventory.coinage.map((a: Coinage, x: number) => <CoinageDrawer key={x} coinage={a} count={player?.inventory.coinageAmount[x]} />)
        }
      </div>
      <DamageOverlay />
      <Crosshair />
      <HealthBar />

      {/* Weapons List */}
      <div className="player-hud__weapons-section">
        {player?.inventory.hotbar?.map((weapon, index) => (
          <div key={index} className={`player-hud__weapon-item ${player.inventory.selectedItemId == index ? "" : "player-hud__weapon-item--selected"}`}>
            <span className="player-hud__weapon-name">{weapon.img}</span>
            <span className="player-hud__weapon-ammo">{weapon.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHUD;