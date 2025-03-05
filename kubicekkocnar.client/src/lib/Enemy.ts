import * as THREE from 'three';
import { PathFinder } from './PathFinding';
import Level from './Level';
import { EnemyType } from '../types/Enemy';
import { FetchLevelEnemies } from '../api/Enemies';
import { GetTextureURL } from '../api/Textures';

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

export class Enemy {
  public type: EnemyType;
  public hp: number = 0;

  public isOnCooldown: boolean = false;
  public mesh: THREE.Mesh | null = null;

  constructor(type: EnemyType) {
    this.type = type;
  }

  public takeDamage(damage: number, die: () => void) {
    this.hp -= damage;
    if (this.hp <= 0) {
      die();
    }
  }
}

export class EnemyRenderer {
  public MAX_ENEMIES = 10;

  public enemies: Enemy[] = [];
  public scene: THREE.Scene;

  public pathFinder: PathFinder;
  public level: Level;

  public enemiesData: EnemyType[] = [];

  public addPlayerHealth?: ((health: number) => void);

  public spawnRandomEnemy() {
    this.addEnemy(this.enemiesData[Math.floor(Math.random() * this.enemiesData.length)]);
  }

  public addEnemy(type: EnemyType) {
    if (this.enemies.length >= this.MAX_ENEMIES) return;

    const enemy: Enemy = new Enemy(type);

    this.enemies.push(enemy);

    const loadedTexture = textureLoader.load(GetTextureURL(type.textureId));
    const geometry = new THREE.PlaneGeometry(3, 3);
    const material = new THREE.MeshStandardMaterial({
      map: loadedTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: type.isGhost ? .5 : 1
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.name = "enemy";
    enemy.mesh = plane;
    enemy.mesh.userData.enemy = enemy;
    this.scene.add(plane);

    const blocks = Array.from(this.pathFinder.wakableBlocksDictionary).filter(block => block[1].state.includes("corrupt"));
    if (blocks.length != 0) {
      const randomBlock = blocks[Math.floor(Math.random() * blocks.length)][1];
      const position = randomBlock.mesh?.position.clone().add(new THREE.Vector3(0, 2, 0));
      plane.position.set(position!.x, position!.y, position!.z);
    }

  }

  public RemoveEnemy(enemy: Enemy) {
    this.enemies = this.enemies.filter(e => e != enemy);
    this.scene.remove(enemy.mesh!);
  }

  constructor(scene: THREE.Scene, level: Level) {
    this.scene = scene;
    this.level = level;

    this.loadEnemies();

    this.pathFinder = new PathFinder(level.blocks);
  }

  private loadEnemies() {
    FetchLevelEnemies(0, this.level.levelId).then((enemies) => {
      this.enemiesData = enemies;
    });
  }

  public update() {
    const player = this.scene.userData.camera
    this.enemies.forEach(enemy => {
      if (enemy.mesh) {
        //make the enemy look at the player, but not vertically
        enemy.mesh.lookAt(player.position.clone().sub(this.scene.position).setY(enemy.mesh.position.y));
        const distance = enemy.mesh.position.distanceTo(player.position.clone().sub(this.scene.position));
        if (distance > 1) {
          if (enemy.type.isGhost) {
            enemy.mesh.position.add(player.position.clone().sub(enemy.mesh.position).normalize().multiplyScalar(enemy.type.speed / 1000));
            return;
          }

          const blockBelowEnemy = this.pathFinder.GetClosestBlock(enemy.mesh.position.clone().sub(new THREE.Vector3(0, 2, 0)));
          const blockBelowPlayer = this.pathFinder.GetClosestBlock(player.position.clone().sub(new THREE.Vector3(0, 2, 0)).sub(this.scene.position));

          if (!blockBelowEnemy) {
            console.warn("No block below enemy");
            return;
          }

          if (!blockBelowPlayer) {
            console.warn("No block below enemy");
            return;
          }

          const path = this.pathFinder.FindPath(blockBelowEnemy, blockBelowPlayer);

          if (path.length > 1) {
            const nextBlock = path[1];
            enemy.mesh.position.add(nextBlock.position.clone().add(new THREE.Vector3(0, 2, 0)).sub(enemy.mesh.position).normalize().multiplyScalar(enemy.type.speed / 1000));
          }
        }
        if (!enemy.isOnCooldown && distance < 1.5 && this.addPlayerHealth) {
          //attack player
          this.addPlayerHealth(-enemy.type.damage);
          enemy.isOnCooldown = true;
          setTimeout(() => {
            enemy.isOnCooldown = false;
          }, enemy.type.attackSpeed);
        }
      }
    });
  }
}