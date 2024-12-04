import * as THREE from "three";

export class FirstPersonController {
  private camera: THREE.Camera;
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private rotation: THREE.Quaternion = new THREE.Quaternion(); // Base quaternion
  private pitch: THREE.Quaternion = new THREE.Quaternion(); // For up/down rotation
  private yaw: THREE.Quaternion = new THREE.Quaternion(); // For left/right rotation
  private move: { forward: boolean; backward: boolean; left: boolean; right: boolean } = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };
  private touchStart: { x: number; y: number } = { x: 0, y: 0 };
  private viewBobPhase: number = 0; // For view bobbing effect

  constructor(camera: THREE.Camera) {
    this.camera = camera;
  }

  public handleMouseMove(event: MouseEvent) {
    const sensitivity = 0.002;

    // Horizontal yaw (rotate around world Y-axis)
    const yawDelta = -event.movementX * sensitivity;
    const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yawDelta);
    this.rotation.multiplyQuaternions(yawQuaternion, this.rotation);

    // Vertical pitch (rotate around camera's local X-axis)
    const pitchDelta = -event.movementY * sensitivity;
    const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitchDelta);

    // Combine pitch rotation and clamp vertical look
    const tempRotation = new THREE.Quaternion().copy(this.rotation).multiply(pitchQuaternion);
    const euler = new THREE.Euler().setFromQuaternion(tempRotation, "YXZ");
    euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x)); // Clamp pitch
    this.rotation.setFromEuler(euler);

    // Apply updated quaternion to the camera
    this.camera.quaternion.copy(this.rotation);
}


  public handleTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.touchStart = { x: touch.pageX, y: touch.pageY };
    }
  }

  public handlePointerLockChange(isLocked: boolean) {
    if (!isLocked) {
      this.move = { forward: false, backward: false, left: false, right: false };
    }
  }

  public handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const sensitivity = 0.002;

      const yawDelta = -(touch.pageX - this.touchStart.x) * sensitivity;
      const pitchDelta = -(touch.pageY - this.touchStart.y) * sensitivity;

      this.yaw.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yawDelta);

      const pitchAxis = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
      const newPitch = new THREE.Quaternion().setFromAxisAngle(pitchAxis, pitchDelta);
      this.pitch.multiply(newPitch);

      const euler = new THREE.Euler().setFromQuaternion(this.pitch, "YXZ");
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
      this.pitch.setFromEuler(euler);

      this.rotation.multiplyQuaternions(this.yaw, this.pitch);
      this.camera.quaternion.copy(this.rotation);

      this.touchStart = { x: touch.pageX, y: touch.pageY };
    }
  }

  public handleKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
        this.move.forward = true;
        break;
      case "KeyS":
        this.move.backward = true;
        break;
      case "KeyA":
        this.move.left = true;
        break;
      case "KeyD":
        this.move.right = true;
        break;
    }
  }

  public handleKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
        this.move.forward = false;
        break;
      case "KeyS":
        this.move.backward = false;
        break;
      case "KeyA":
        this.move.left = false;
        break;
      case "KeyD":
        this.move.right = false;
        break;
    }
  }

  public update(delta: number) {
    const speed = 6; // Movement speed

    // Update velocity based on input
    this.velocity.set(0, 0, 0);
    if (this.move.forward) this.velocity.z += 1; // Move forward
    if (this.move.backward) this.velocity.z -= 1; // Move backward
    if (this.move.left) this.velocity.x -= 1; // Strafe left
    if (this.move.right) this.velocity.x += 1; // Strafe right

    this.velocity.normalize().multiplyScalar(speed * delta);

    console.log(delta);
    

    // Calculate the forward and right directions based on the camera's rotation
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion).normalize();

    // Move the camera
    const movement = new THREE.Vector3()
        .add(forward.multiplyScalar(this.velocity.z)) // Forward/backward
        .add(right.multiplyScalar(this.velocity.x)); // Left/right

    this.camera.position.add(movement);

    // View bobbing effect
    if (this.move.forward || this.move.backward || this.move.left || this.move.right) {
        this.viewBobPhase += delta * 10; // Adjust bobbing speed
        this.camera.position.y = 2+ Math.sin(this.viewBobPhase) * 0.15; // Bobbing amplitude, the 2 is the player's height and its only temporary, sice you will be able to go up later
    } else {
        this.viewBobPhase = 0; // Reset view bobbing phase when not moving
    }
}

}
