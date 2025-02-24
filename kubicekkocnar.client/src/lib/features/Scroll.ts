import GenericFeature from "../../types/Feature";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export interface Scroll extends GenericFeature {
  params: {
    text: string;
  };
}

const path = "/models/scroll.glb"

const loader = new GLTFLoader();

export default function render(scroll: Scroll) { // Add scene parameter
  return new Promise<void>((resolve) => {

    loader.load(path, function (gltf) {

      scroll.object = gltf.scene.clone();
      scroll.object.position.set(scroll.position?.x || 0, scroll.position?.y || 0, scroll.position?.z || 0);
      scroll.object.userData.scroll = scroll;

      // This name does not work btw, so fix it maybe, idk
      scroll.object.name = "scroll";

      resolve();

    }, undefined, function (error) {
      console.error(error);
    });
  });
}