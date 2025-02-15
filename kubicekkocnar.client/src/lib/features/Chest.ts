import GenericFeature from "../../types/Feature";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

type ChestInventory = { id: number, count: number }[]
interface Chest extends GenericFeature {
  params: {
    inventory: string | ChestInventory;
  };
}

const path = "/models/chest.glb"

const loader = new GLTFLoader();

async function render(chest: Chest) {
  return new Promise<void>((resolve) => {
    convert(chest);
    loader.load(path, function (gltf) {

      chest.object = gltf.scene.clone();
      chest.object.position.set(chest.position?.x || 0, chest.position?.y || 0, chest.position?.z || 0);

      chest.object.userData.chest = chest;

      console.log(`Loaded model from ${path}`, gltf);
      resolve();

    }, undefined, function (error) {
      console.error(error);
    });
  });
}

function convert(chest: Chest) {
  return chest.params.inventory = JSON.parse(chest.params.inventory as string);
}

export default render;
export type { Chest };
