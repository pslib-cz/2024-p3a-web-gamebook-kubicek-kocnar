import { useContext, useEffect } from "react";
import Level from "../lib/Level";
import { GameContext } from "../contexts/GameContext";
import { AppContext } from "./AppContextProvider";

export function Enemies({ level }: { level: Level }) {
  const { addPlayerHealth } = useContext(GameContext);
  const { player} = useContext(AppContext);

  function addPlayerHealthssd(health: number) {
    addPlayerHealth(health);
    
    if (player)
      player.health += health;
  }

  useEffect(() => {    
    level.enemyRenderer.addPlayerHealth = addPlayerHealthssd;
  });
  return null;
}