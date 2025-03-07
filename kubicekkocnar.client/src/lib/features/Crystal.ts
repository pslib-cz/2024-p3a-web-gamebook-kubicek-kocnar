import GenericFeature from "../../types/Feature";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const path = "/models/crystal.glb"

const loader = new GLTFLoader();

async function render(crystal: GenericFeature) {
  return new Promise<void>((resolve) => {
    loader.load(path, function (gltf) {

        crystal.object = gltf.scene.clone();
        crystal.object.position.set(crystal.position?.x || 0, crystal.position?.y || 0, crystal.position?.z || 0);

        crystal.object.userData.chest = crystal;
      
      resolve();

    }, undefined, function (error) {
      console.error(error);
    });
  });
}

export default render;
