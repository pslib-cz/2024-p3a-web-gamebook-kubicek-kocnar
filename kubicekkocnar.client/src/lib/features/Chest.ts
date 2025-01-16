import GenericFeature from "../../types/Feature";
import { Item } from "../../types/Item";
import { useLoader } from '@react-three/fiber';
// @ts-expect-error js ain't ts
import { GLTFLoader } from '../../loaders/GLTFLoader.js';

type ChestInventory = {item: Item, count: number}[]
interface Chest extends GenericFeature {
    params: {
        inventory: ChestInventory
    };
}


async function render (chest: Chest) {
    const path = "../../../../models/chest.glb"

    const gltf = await useLoader(GLTFLoader, path);

    console.log(`Loaded model from ${path}`, gltf);
    
    const clonedScene = gltf.scene.clone();
    clonedScene.position.set(chest.position?.x, chest.position?.y, chest.position?.z);

    return clonedScene;
}

export default render;
export type { Chest };
