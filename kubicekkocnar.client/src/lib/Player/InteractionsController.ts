import * as THREE from "three";
import { Enemy } from "../Enemy";
import { Scroll } from "../features/Scroll";
import { Chest } from "../features/Chest";
import { Coinage } from "../../types/Coinage";
import { Player } from "./Player";
import CorruptionHandler from "../CorruptionHandler";
import { Potator } from "../features/Potator";
import PlacedBlock from "../../types/PlacedBlock";
import toast from "react-hot-toast";

export class InteractionsController {

  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  public onCLick() {
    const positionsd: THREE.Vector3 = new THREE.Vector3();

    positionsd.copy(this.player.camera.position);
    positionsd.add(this.player.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1));

    const interactables = this.getOtherFeaturesAndStuffBTWfr(positionsd, ["enemy", "Paper", "Chest", "Potator"]);

    const hitEnemies = interactables.filter((obj) => obj.name.includes("enemy"));
    const hitPapers = interactables.filter((obj) => obj.name.includes("Paper"));
    const hitChests = interactables.filter((obj) => obj.name.includes("Chest"));
    const hitPotators = interactables.filter((obj) => obj.name.includes("Potator"));

    hitEnemies.forEach((enemyMesh) => {
      const enemy = enemyMesh.userData.enemy as Enemy;
      console.log("Hit enemy:", enemy);

      enemy.takeDamage(10, () => {
        this.player.scene.userData.level.enemyRenderer.RemoveEnemy(enemy);
        enemy.type.reward.forEach((reward) => {
          this.player.inventory.addToCoinage(reward.coinage.name, reward.cost);
        }, []);
      })
    });

    if (hitPapers.length > 0) {
      const scroll = hitPapers[0].userData.scroll as Scroll;
      this.player.story.AddStory(scroll);
    }

    if (hitChests.length > 0) {
      const chest = hitChests[0].userData.chest as Chest;

      if (typeof chest.params.inventory != "string") {
        for (const coinage of chest.params.inventory) {
          const coinageObj = this.player.scene.userData.level.coinages.find((c: Coinage) => c.coinageId == coinage.id)
          this.player.inventory?.addToCoinage(coinageObj?.name || "golden coin", coinage.count);
          console.error("Adding coinage:", coinageObj, coinage.count);
          toast(`You found ${coinage.count} ${coinageObj.name}${coinage.count > 1 ? 's' : ''}!`)
          console.error("player", this.player);
        }
      }

      console.error("Hit chest:", chest);

      console.log(chest.params)
    }

    if (hitPotators.length > 0) {
      console.error("Hit potator:", hitPotators[0].userData.potator);

      const potator = hitPotators[0].userData.potator as Potator;

      const corruption = this.player.scene.userData.level.corruptionHandler as CorruptionHandler;

      // find any first block below potator, it does not have to be corrupt
      const blocks = Array.from(this.player.scene.userData.level.mapRenderer.blocks);
      const blockBelowPotator = blocks.find((block) => {
        const block1 = block as PlacedBlock;
        return block1.position.x == potator.position!.x && block1.position.z == potator.position!.z;
      });

      console.error("Block below potator:", blocks);

      corruption.revert(blockBelowPotator as PlacedBlock);
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