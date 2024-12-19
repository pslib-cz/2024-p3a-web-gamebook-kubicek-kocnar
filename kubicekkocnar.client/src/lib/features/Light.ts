import GenericFeature from "../../types/Feature";
import * as THREE from 'three';

interface Light extends GenericFeature {
    params: {
        color: string;
        intensity: string;
    };
}

function render (light: Light) {
    light.object = new THREE.PointLight( light.params.color, parseFloat(light.params.intensity) || 1 )
}

export default render;
export type { Light };