import { useContext, useEffect } from "react";
import Level from "../lib/Level";
import { EnemyRenderer } from "../lib/Enemy";
import { GameContext } from "../contexts/GameContext";

export function Enemies({level}: {level: Level}) {
    const { addPlayerHealth } = useContext(GameContext);
    useEffect(() => {
        console.log("Creating enemy renderer");
        level.enemyRenderer = new EnemyRenderer(level.mapRenderer.scene, level);
    }, [level]);
    useEffect(() => {
        if (level.enemyRenderer) level.enemyRenderer.addPlayerHealth = addPlayerHealth;
    });
    return null;
}