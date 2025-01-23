import GenericFeature from "../../types/Feature";
import * as THREE from 'three';

interface Light extends GenericFeature {
    params: {
        color: string;
        intensity: string;
    };
}

function render (light: Light) {
    const lightObject = new THREE.PointLight( light.params.color, parseFloat(light.params.intensity) || 1 );
    if (window.location.pathname.includes("editor")) {
        const grp = new THREE.Group();
        const lightHelperSph = new THREE.IcosahedronGeometry( 0.3, 0 );
        const lightHelper = new THREE.Mesh( lightHelperSph, new THREE.MeshBasicMaterial( { color: light.params.color, wireframe: true } ) );
        lightHelper.name = "seeparent lightHelper";
        grp.add(lightObject);
        grp.add(lightHelper);
        light.object = grp;
    }
    else {
        light.object = lightObject;
    }
}

export default render;
export type { Light };