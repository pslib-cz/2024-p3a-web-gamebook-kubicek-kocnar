import GenericFeature, { FeatureType } from "../types/Feature";
import * as THREE from 'three';

interface Light extends GenericFeature {
    params: {
        color: string;
        intensity: string;
    };
}

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
            default:
                return console.error("Unknown feature type", feature.type);
        }

        feature.object.name = 'feature ' + feature.type + ' ' + feature.featureId;
        feature.object.position.set(feature.position!.x, feature.position!.y, feature.position!.z);
        console.log("FeatureRenderer -> ADD ", feature.object.name, feature.object.position);

        this.features.push(feature);
        this.scene.add(feature.object);
    }

    renderLight(light: Light) {
        light.object = new THREE.PointLight( light.params.color, parseFloat(light.params.intensity) )
    }

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