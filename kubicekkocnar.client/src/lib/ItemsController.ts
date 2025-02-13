import * as THREE from "three";
import { Inventory } from "./Inventory";
import { Enemy } from "./Enemy";

export class ItemsController {
  private camera: THREE.Camera;
  private scene: THREE.Scene;
  public playerInventory: Inventory | null = null;

  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    this.camera = camera;
    this.scene = scene;
  }

  public onCLick() {
    const positionsd: THREE.Vector3 = new THREE.Vector3();

    positionsd.copy(this.camera.position);
    positionsd.add(this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1));

    const hitEnemies = this.getEnemies(positionsd);

    console.warn("ONCLICK => This shit is not implemented yet, you have an array of block that were hit tho", hitEnemies);

    hitEnemies.forEach((enemyMesh) => {
      const enemy = enemyMesh.userData.enemy as Enemy;
      console.log("Hit enemy:", enemy);

      enemy.type.health -= 10;

      if (enemy.type.health <= 0) {
        this.scene.userData.level.enemyRenderer.enemies = this.scene.userData.level.enemyRenderer.enemies.filter(e => e.mesh.uuid != enemyMesh.uuid)
        this.scene.remove(enemyMesh);
        console.log("plinv",this.playerInventory)
        this.playerInventory?.addToCoinage("gold", 100)
        console.log("plinv2",this.playerInventory)
      }
    });

  }

  private getEnemies(positionToCheck: THREE.Vector3): THREE.Object3D[] {
    return this.getOtherFeaturesAndStuffBTWfr(positionToCheck, "enemy");
  }

  private getOtherFeaturesAndStuffBTWfr(positionToCheck: THREE.Vector3, tag : string): THREE.Object3D[] {

    const checkBox = new THREE.Box3().setFromCenterAndSize(
      positionToCheck,
      new THREE.Vector3(1, 1, 1) // Collider size
    );

    const enemies = this.scene.children
      .filter((child) => child.name.includes(tag)); // replace this with enemy tag

    const hitEnemies = [];

    // Check for intersections with enemy objects
    for (const enemy of enemies) {
      const enemyBox = new THREE.Box3().setFromObject(enemy);
      if (checkBox.intersectsBox(enemyBox)) hitEnemies.push(enemy);
    }

    return hitEnemies;
  }

}
