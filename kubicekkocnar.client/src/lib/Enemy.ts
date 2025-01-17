import * as THREE from 'three';
import { PathFinder } from './PathFinding';
import Level from './Level';
import { forEach } from 'lodash';

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

export class Enemy {
  public health: number;
  public damage: number;
  public attackSpeed: number; //ms between attacks
  public speed = 50;
  public isOnCooldown: boolean = false;
  public mesh: THREE.Mesh | null = null;

  constructor(health: number, damage: number, attackSpeed: number = 200) {
    this.health = health;
    this.damage = damage;
    this.attackSpeed = attackSpeed
  }
}

export class EnemyRenderer {
  public enemies: Enemy[] = [];
  //public level: Level;
  public scene: THREE.Scene;

  public pathFinder : PathFinder;
  public level : Level;

  public addPlayerHealth?: ((health: number) => void);

  constructor(scene: THREE.Scene, level: Level) {
    this.scene = scene;
    this.level = level;
    this.enemies.push(new Enemy(100, 2));
    this.render();

    this.pathFinder = new PathFinder(level.blocks);
  }
  public render() {
    this.enemies.forEach(enemy => {
      const loadedTexture = textureLoader.load("/obunga.webp");
      const geometry = new THREE.PlaneGeometry(3, 3);
      const material = new THREE.MeshStandardMaterial({ map: loadedTexture, side: THREE.DoubleSide, transparent: true });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 2, 0);
      plane.name = "enemy";
      enemy.mesh = plane;
      enemy.mesh.userData.enemy = enemy;
      this.scene.add(plane);
    });
  }
  public update() {
    const player = this.scene.userData.camera
    this.enemies.forEach(enemy => {
      if (enemy.mesh) {
        enemy.mesh.lookAt(player.position);
        const distance = enemy.mesh.position.distanceTo(player.position.clone().sub(this.scene.position));
        if (distance > 1)
        {
          //enemy.mesh.position.add(player.position.clone().sub(enemy.mesh.position).normalize().multiplyScalar(enemy.speed / 1000));

          const blockBelowEnemy = this.pathFinder.GetClosestBlock(enemy.mesh.position.clone().sub(new THREE.Vector3(0, 2, 0)));

          const blockBelowPlayer = this.pathFinder.GetClosestBlock(player.position.clone().sub(new THREE.Vector3(0, 2, 0)).sub(this.scene.position));

          const path = this.pathFinder.FindPath(blockBelowEnemy, blockBelowPlayer);
          
          if (path.length > 1)
          {
            const nextBlock = path[1];
            enemy.mesh.position.add(nextBlock.position.clone().add(new THREE.Vector3(0, 2, 0)).sub(enemy.mesh.position).normalize().multiplyScalar(enemy.speed / 1000));
          }
        }
        if (!enemy.isOnCooldown && distance < 1.5 && this.addPlayerHealth) {
          //attack player
          this.addPlayerHealth(-enemy.damage);
          enemy.isOnCooldown = true;
          setTimeout(() => {
            enemy.isOnCooldown = false;
          }, enemy.attackSpeed);
        }
      }
    });
  }
}