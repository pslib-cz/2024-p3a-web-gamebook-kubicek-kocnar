import * as THREE from "three";
import { Enemy } from "../components/Enemies";

export class ItemsController {
  private camera: THREE.Camera;
  private scene: THREE.Scene;

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

      enemy.health -= 10;
    });

  }

  private getEnemies(positionToCheck: THREE.Vector3): THREE.Object3D[] {
    const checkBox = new THREE.Box3().setFromCenterAndSize(
      positionToCheck,
      new THREE.Vector3(1, 1, 1) // Collider size
    );

    const enemies = this.scene.children
      .filter((child) => child.name.includes('enemy')); // replace this with enemy tag

    const hitEnemies = [];

    // Check for intersections with enemy objects
    for (const enemy of enemies) {
      const enemyBox = new THREE.Box3().setFromObject(enemy);
      if (checkBox.intersectsBox(enemyBox)) hitEnemies.push(enemy);
    }

    return hitEnemies;
  }

}
