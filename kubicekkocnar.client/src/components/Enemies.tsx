import { useContext, useEffect } from "react";
import Level from "../lib/Level";
import { GameContext } from "../contexts/GameContext";
import { AppContext } from "./AppContextProvider";

export function Enemies({ level }: { level: Level }) {
  const { addPlayerHealth, playerHealth } = useContext(GameContext);
  const { player } = useContext(AppContext);

  function addPlayerHealthssd(health: number) {
    if (playerHealth < 0 && health < 0) return;

    addPlayerHealth(health);

    if (player)
      player.health += health;
  }

  useEffect(() => {
    if (level.enemyRenderer)
      level.enemyRenderer.addPlayerHealth = addPlayerHealthssd;
  });
  return null;
}