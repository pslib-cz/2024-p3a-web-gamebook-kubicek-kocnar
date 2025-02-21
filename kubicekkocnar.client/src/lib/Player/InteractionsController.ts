import * as THREE from "three";
import { Enemy } from "../Enemy";
import { Scroll } from "../features/Scroll";
import { Chest } from "../features/Chest";
import { Coinage } from "../../types/Coinage";
import { Player } from "./Player";

export class InteractionsController {
  
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  public onCLick() {
    const positionsd: THREE.Vector3 = new THREE.Vector3();

    positionsd.copy(this.player.camera.position);
    positionsd.add(this.player.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1));

    const interactables = this.getOtherFeaturesAndStuffBTWfr(positionsd, ["enemy", "Paper", "Chest"]);

    const hitEnemies = interactables.filter((obj) => obj.name.includes("enemy"));
    const hitPapers = interactables.filter((obj) => obj.name.includes("Paper"));
    const hitChests = interactables.filter((obj) => obj.name.includes("Chest"));

    console.warn("ONCLICK => This shit is not implemented yet, you have an array of block that were hit tho", hitEnemies);

    hitEnemies.forEach((enemyMesh) => {
      const enemy = enemyMesh.userData.enemy as Enemy;
      console.log("Hit enemy:", enemy);

      enemy.takeDamage(10, () => {
        this.player.scene.userData.level.enemyRenderer.enemies = this.player.scene.userData.level.enemyRenderer.enemies.filter(e => e.mesh.uuid != enemyMesh.uuid)
        this.player.scene.remove(enemyMesh);
        this.player.inventory.addToCoinage("golden coin", 100)
      })

    });

    if (hitPapers.length > 0) {
      const scroll = hitPapers[0].userData.scroll as Scroll;

      console.error("Hit scroll:", scroll);

      this.player.story.AddStory(scroll)      

      console.log(scroll.params.text)
    }

    if (hitChests.length > 0)
    {
      const chest = hitChests[0].userData.chest as Chest;

      if (typeof chest.params.inventory != "string") {
        for (const coinage of chest.params.inventory) {
          const coinageObj = this.player.scene.userData.level.coinages.find((c:Coinage) => c.coinageId == coinage.id)
          this.player.inventory?.addToCoinage(coinageObj?.name || "golden coin", coinage.count);
          console.error("Adding coinage:", coinageObj, coinage.count);
          alert(`You found ${coinage.count} ${coinageObj.name}${coinage.count > 1 ? 's' : ''}!`)
          console.error("player", this.player);
        }
      }

      console.error("Hit chest:", chest);

      console.log(chest.params)
    }

  }

  private getOtherFeaturesAndStuffBTWfr(positionToCheck: THREE.Vector3, tags: string[]): THREE.Object3D[] {
    const checkBox = new THREE.Box3().setFromCenterAndSize(
      positionToCheck,
      new THREE.Vector3(1, 1, 1) // Collider size
    );

    const interactables = this.player.scene.children.filter((child) =>
      tags.some(tag => child.name.includes(tag))
    );

    const hitObjects = [];

    // Check for intersections with objects
    for (const obj of interactables) {
      const objBox = new THREE.Box3().setFromObject(obj);
      if (checkBox.intersectsBox(objBox)) hitObjects.push(obj);
    }

    return hitObjects;
  }
}