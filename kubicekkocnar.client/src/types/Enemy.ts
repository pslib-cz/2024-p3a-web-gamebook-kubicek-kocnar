
export interface EnemyType {
  enemyId: number;
  name: string;
  health: number;
  damage: number;
  attackSpeed: number; //ms between attacks
  speed: number;
  isGhost : boolean;
  textureId: number;
}