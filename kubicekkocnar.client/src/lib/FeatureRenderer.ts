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
                console.error("Unknown feature type", feature.type);
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
        const removeIndex = this.features.findIndex(f => f.featureId === feature.featureId);
        if (removeIndex > -1) {
            console.log('FeatureRenderer -> RM ', feature.object?.name, feature.object?.position);
            this.scene.remove(feature.object);
            this.features.splice(removeIndex, 1);
        }
    }
}

export default FeatureRenderer;