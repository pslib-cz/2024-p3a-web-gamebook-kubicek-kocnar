import * as THREE from "three";

export class ItemsController {
  private camera: THREE.Camera;
  private scene: THREE.Scene;

  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    this.camera = camera;
    this.scene = scene;
  }

  public onCLick()
  {
    const positionsd : THREE.Vector3 = new THREE.Vector3();

    positionsd.copy(this.camera.position);
    positionsd.add(this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1));

    
    console.warn("ONLICK => This shit is not implemented yet, you have an array of block that were hit tho", this.getColliders(positionsd))
  }

  private getColliders(positionToCheck: THREE.Vector3): THREE.Box3[] {

    const checkBox = new THREE.Box3().setFromCenterAndSize(
      positionToCheck,
      new THREE.Vector3(1, 1, 1) // Collider size
    );

    const obstacles = this.scene.children
      .filter((child) => child.name.includes('block')) // replace this with enemy tag
      .map((obstacle) => new THREE.Box3().setFromObject(obstacle));
  
    const colliders = [];

    // Check for intersections with collidable objects
    for (const object of obstacles) {        
      if (checkBox.intersectsBox(object)) colliders.push(object);
    }

    return colliders;
  }

}
