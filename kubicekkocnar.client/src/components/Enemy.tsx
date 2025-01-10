import { useRef } from "react";

export function EnemyObj() {
  
  const enemyRef = useRef<Enemy>(new Enemy(100, 10));
  const enemy = enemyRef.current;
  return (
    <></>
  );
}

export class Enemy{
  
  public health: number;
  public damage: number;

  constructor(health: number, damage: number)
  {
    this.health = health;
    this.damage = damage;
  }
}