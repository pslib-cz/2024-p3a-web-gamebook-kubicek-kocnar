import GenericFeature from "../../types/Feature";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface Scroll extends GenericFeature {
  params: {
    text: string;
  };
}

const path = "../../../../models/chest.glb"

const loader = new GLTFLoader();

export default function render(scroll: Scroll) {
  return new Promise<void>((resolve) => {

    loader.load(path, function (gltf) {

      scroll.object = gltf.scene.clone();
      scroll.object.position.set(scroll.position?.x || 0, scroll.position?.y || 0, scroll.position?.z || 0);

      console.log(`Loaded model from ${path}`, gltf);

      resolve();

    }, undefined, function (error) {
      console.error(error);
    });
  });
}

export type { Scroll };