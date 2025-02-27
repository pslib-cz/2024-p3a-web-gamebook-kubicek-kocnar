import GenericFeature from "../../types/Feature";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export interface Potator extends GenericFeature {
  params: {
    
  };
}

const path = "/models/statue.glb"

const loader = new GLTFLoader();

async function render(potator: Potator) {
  return new Promise<void>((resolve) => {
    convert(potator);
    loader.load(path, function (gltf) {

      potator.object = gltf.scene.clone();
      potator.object.position.set(potator.position?.x || 0, potator.position?.y || 0, potator.position?.z || 0);

      potator.object.userData.potator = potator;

      console.log(`Loaded model from ${path}`, gltf);
      resolve();

    }, undefined, function (error) {
      console.error(error);
    });
  });
}

function convert(potator: Potator) {
  //return chest.params.inventory = JSON.parse(chest.params.inventory as string);
}

export default render;
