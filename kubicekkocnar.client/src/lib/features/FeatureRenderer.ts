import GenericFeature, { FeatureType } from "../../types/Feature";
import * as THREE from 'three';
import renderLight, { Light } from "./Light";
import renderPortal, { Portal } from "./Portal";
import renderChest, { Chest } from "./Chest";

const source = window.location.search.includes('source=') ? window.location.search.split('source=')[1].split('&')[0] : null;


class FeatureRenderer {
    scene: THREE.Scene;
    features: GenericFeature[];
    featureCounter = 0;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.features = [];
    }
    
    addFeature(feature: GenericFeature) {
        if (!feature.featureId) {
            // clientside blocks have a featureId above 1000000
            feature.featureId = 1000000 + this.featureCounter++;
        }
        if (this.features.find(f => f.featureId === feature.featureId)) {
            console.error("This feature is already in the scene", feature.featureId);
            return;
        }
        switch (feature.type) {
            case FeatureType.Light:
                this.renderLight(feature as Light);
                break;

            case FeatureType.Portal:
                this.renderPortal(feature as Portal);
                break;

            case FeatureType.Chest:
                this.renderChest(feature as Chest);
                break;

            default:
                return console.error("Unknown feature type", feature.type);
        }
        // check if query params contain source=number, if yes, then set the camera position to the source portal
        if (source && feature.type === FeatureType.Portal && feature.params.destination == source) {
            const tpPos = new THREE.Vector3(-feature.position!.x, -feature.position!.y, -feature.position!.z);
            switch (feature.params.facing) {
                case 'X+': tpPos.x -= .5; break;
                case 'X-': tpPos.x += .5; break;
                case 'Y+': tpPos.y -= .5; break;
                case 'Y-': tpPos.y += .5; break;
                case 'Z+': tpPos.z -= .5; break;
                case 'Z-': tpPos.z += .5; break;
            }
            console.log("Teleporting to ", tpPos);
            
            this.scene.position.set(tpPos.x, tpPos.y-.51, tpPos.z);
            //set the camera position to the 0,0,0
            console.log(this.scene.getObjectsByProperty('isCamera', 'true '))
            this.scene.userData.camera?.position.set(0, 0, 0);            
        }

        feature.object.name = 'feature ' + FeatureType[feature.type] + ' ' + feature.featureId;
        feature.object.position.set(feature.position!.x, feature.position!.y, feature.position!.z);
        console.log("FeatureRenderer -> ADD ", feature.object.name, feature.object.position);

        this.features.push(feature);
        this.scene.add(feature.object);
    }

    renderLight = renderLight;
    renderPortal = renderPortal;
    renderChest = renderChest

    removeFeature(feature: GenericFeature) {
        const removedFeature = this.features.find(f => f.featureId === feature.featureId);
        if (removedFeature) {
            console.log('FeatureRenderer -> RM ', FeatureType[removedFeature.type], removedFeature.featureId);
            this.scene.remove(removedFeature.object);
            this.features = this.features.filter(f => f.featureId !== feature.featureId);
        }
    }

    static transformFeature(feature: {x: number, y: number, z: number}) {
        return {
            ...feature,
            position: new THREE.Vector3(feature.x, feature.y, feature.z)
        } as unknown as GenericFeature;
    }

}

export default FeatureRenderer;
export type { Light };