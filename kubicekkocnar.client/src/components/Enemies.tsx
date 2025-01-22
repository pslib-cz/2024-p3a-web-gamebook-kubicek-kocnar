import { useContext, useEffect } from "react";
import Level from "../lib/Level";
import { EnemyRenderer } from "../lib/Enemy";
import { GameContext } from "../contexts/GameContext";
import { AppContext } from "./AppContextProvider";

export function Enemies({ level }: { level: Level }) {

  const { setEnemyHandler } = useContext(AppContext);

  const { addPlayerHealth } = useContext(GameContext);
  useEffect(() => {
    
    console.log("Creating enemy renderer");
    level.enemyRenderer = new EnemyRenderer(level.mapRenderer.scene, level);

    setEnemyHandler(level.enemyRenderer);
  }, [level]);
  useEffect(() => {
    if (level.enemyRenderer) level.enemyRenderer.addPlayerHealth = addPlayerHealth;
  });
  return null;
}