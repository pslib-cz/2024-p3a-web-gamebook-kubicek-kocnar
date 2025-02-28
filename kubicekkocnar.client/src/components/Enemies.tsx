import { useContext, useEffect } from "react";
import Level from "../lib/Level";
import { GameContext } from "../contexts/GameContext";

export function Enemies({ level }: { level: Level }) {
  const { addPlayerHealth } = useContext(GameContext);

  useEffect(() => {
    
    level.enemyRenderer.addPlayerHealth = addPlayerHealth;
  });
  return null;
}