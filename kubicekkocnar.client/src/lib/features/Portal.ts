import GenericFeature from "../../types/Feature";
import * as THREE from 'three';

interface Portal extends GenericFeature {
    params: {
        source: string;
        destination: string;
        facing: "X+" | "X-" | "Y+" | "Y-" | "Z+" | "Z-";
        width: string;
        height: string;
        color: string;
    };
}

const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
// portalFragmentShader.glsl
uniform vec3 portalColor;
uniform float time;

varying vec2 vUv;

void main() {
    // Convert UV coordinates to polar coordinates
    vec2 centeredUV = vUv - vec2(0.5); // Center the UV coordinates at (0.5, 0.5)
    float angle = atan(centeredUV.y, centeredUV.x);
    float radius = length(centeredUV);

    // Add more twist by distorting the angle with time and radius
    float twistedAngle = angle + sin(radius * 15.0 - time * 2.0) * 0.5;

    // Create a spiral effect with tighter, twisted spirals
    float spiral = sin(30.0 * radius - time * 5.0 + twistedAngle * 15.0);

    // Smooth the spiral bands
    float wave = smoothstep(0.3, 0.6, spiral);

    // Apply the spiral effect as the color
    vec3 color = portalColor * wave;

    gl_FragColor = vec4(color, 1.0);
}

`



function render (portal: Portal) {
    const uniforms = { 
        portalColor: { value: new THREE.Color(portal.params.color) },
        time: { value: 0 } 
    };

    const geometry = new THREE.BoxGeometry( parseFloat(portal.params.width), parseFloat(portal.params.height), 0.1 );
    const material = new THREE.ShaderMaterial({vertexShader, fragmentShader, uniforms});
    portal.object = new THREE.Mesh( geometry, material );
    portal.object.position.set(portal.position!.x, portal.position!.y, portal.position!.z);
    // facing
    switch (portal.params.facing) {
        case "X+":
        case "X-":
            portal.object.rotation.y = Math.PI / 2;
            break;
        case "Y+":
        case "Y-":
            portal.object.rotation.x = Math.PI / 2;
            break;
        case "Z+":
        case "Z-":
            break;
    }
    portal.object.userData = { source: portal.params.source, destination: portal.params.destination };

    setInterval(() => {
        uniforms.time.value += 0.05;
    }, 1000 / 30);

}

export default render;
export type { Portal };
