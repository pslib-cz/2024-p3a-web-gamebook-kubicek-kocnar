import MapRenderer from "./MapRenderer";
import * as THREE from "three";

export default class MapEditor {

  public mapRenderer: MapRenderer

  constructor(mapRenderer: MapRenderer) {
    this.mapRenderer = mapRenderer;
  }

  public moveCursorOutline(event: MouseEvent, scene: THREE.Scene, camera: THREE.Camera, gl: THREE.WebGLRenderer) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children)
      .filter(intersect => intersect.object.name.startsWith("block") && intersect.object.userData.attributes.includes("block"));

    if (intersects.length > 0) {
      gl.domElement.style.cursor = "pointer";
      scene.getObjectByName("cursorcube")?.position.set(intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z);
    } else {
      gl.domElement.style.cursor = "auto";
    }
  }
}