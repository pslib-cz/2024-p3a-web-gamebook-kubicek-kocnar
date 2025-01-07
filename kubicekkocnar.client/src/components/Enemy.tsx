import { useRef } from "react";

export function EnemyObj() {
  
  const enemyRef = useRef<Enemy>(new Enemy(100, 10));
  const enemy = enemyRef.current;

  return (
    <mesh position={[0, 2, 0]} name="enemy-1" userData={{ enemy }}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
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