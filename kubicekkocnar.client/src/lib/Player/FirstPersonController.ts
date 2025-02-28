import * as THREE from "three";
import { JoystickOutputData } from "../../components/game/Joystick";

export class FirstPersonController {
  camera: THREE.Camera;
  velocity: THREE.Vector3 = new THREE.Vector3();
  rotation: THREE.Quaternion = new THREE.Quaternion(); // Base quaternion
  pitch: THREE.Quaternion = new THREE.Quaternion(); // For up/down rotation
  yaw: THREE.Quaternion = new THREE.Quaternion(); // For left/right rotation
  touchStart: { x: number; y: number } = { x: 0, y: 0 };
  viewBobPhase: number = 0; // For view bobbing effect

  acceleration: number = 0; // Acceleration
  isGrounded: boolean = true; // Check if player is on the ground
  lastGrounded: boolean = true; // Check if player was on the ground last frame
  scene: THREE.Scene;
  playerPosition: THREE.Vector3 = new THREE.Vector3();

  private saveCounter: number = 0;

  private navigate;

  stopped: boolean = false;

  canJump: boolean = true;

  constructor(camera: THREE.Camera, scene: THREE.Scene, navigate: (levelId: string) => void) {

    if (!scene) throw new Error("Scene is not defined");

    this.camera = camera;
    this.scene = scene;
    this.navigate = navigate;

    this.playerPosition = this.camera.position.clone();
  }

  public handleMouseMove(event: MouseEvent) {
    const sensitivity = 0.002;

    // Horizontal yaw (rotate around world Y-axis)
    const yawDelta = -event.movementX * sensitivity;
    const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yawDelta);
    this.rotation.multiplyQuaternions(yawQuaternion, this.rotation);

    // Vertical pitch (rotate around camera's local X-axis)
    const pitchDelta = Math.min(.1, Math.max(-.1, -event.movementY * sensitivity));

    const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitchDelta);

    // Combine pitch rotation and clamp vertical look
    const tempRotation = new THREE.Quaternion().copy(this.rotation).multiply(pitchQuaternion)
    const euler = new THREE.Euler().setFromQuaternion(tempRotation, "YXZ");
    euler.x = Math.max(-Math.PI / 2.25, Math.min(Math.PI / 2.25, euler.x)); // Clamp pitch

    euler.z = 0; // Reset roll

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
      this.joystickData = new JoystickOutputData();
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

  public handleJump() {
    console.log("jumping", this.isGrounded, this.lastGrounded);
    if (this.canJump && (this.isGrounded || this.lastGrounded)) {
      this.joystickData.up = true;
      this.isGrounded = false;
      this.canJump = false;
      setTimeout(() => {
        this.canJump = true;
      }, 500)
    }
  }

  public handleKeyDown(event: KeyboardEvent) {

    switch (event.code) {
      case "KeyW":
        this.joystickData.fwdValue = 1;
        break;
      case "KeyS":
        this.joystickData.bkdValue = 1;
        break;
      case "KeyA":
        this.joystickData.lftValue = 1;
        break;
      case "KeyD":
        this.joystickData.rgtValue = 1;
        break;
      case "Space":
        this.handleJump();
        break;
    }
  }

  public handleKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
        this.joystickData.fwdValue = 0;
        break;
      case "KeyS":
        this.joystickData.bkdValue = 0;
        break;
      case "KeyA":
        this.joystickData.lftValue = 0;
        break;
      case "KeyD":
        this.joystickData.rgtValue = 0;
        break;
      case "Space":
        this.joystickData.up = false;
        break;
    }
  }

  public update(delta: number) {

    this.saveCounter += delta;
    if (this.saveCounter > 2) {
      this.savePlayerPosition();
      this.saveCounter = 0;
    }

    if (this.playerPosition.y < -100) {
      this.playerPosition.setY(20)
    }

    if (this.stopped) return;
    this.lastGrounded = this.isGrounded;
    const speed = 6; // Movement speed

    // Update velocity based on input
    this.velocity.set(0, 0, 0);
    if (this.joystickData.fwdValue) this.velocity.z += 1; // Move forward
    if (this.joystickData.bkdValue) this.velocity.z -= 1; // Move backward
    if (this.joystickData.lftValue) this.velocity.x -= 1; // Strafe left
    if (this.joystickData.rgtValue) this.velocity.x += 1; // Strafe right

    this.velocity.normalize().multiplyScalar(speed * delta);

    if (this.joystickData.up) {
      this.acceleration -= .5; // Jump
      this.joystickData.up = false;
    }

    // Calculate the forward and right directions based on the camera's rotation
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();

    // to calculate forward use only the x and z components
    forward.y = 0;
    forward.normalize()

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion).normalize();
    const up = new THREE.Vector3(0, 1, 0);

    // Move the camera
    const movement = new THREE.Vector3()
      .add(forward.multiplyScalar(this.velocity.z)) // Forward/backward
      .add(right.multiplyScalar(this.velocity.x)) // Left/right
      .add(up.multiplyScalar(this.velocity.y));

    // Vertical movement (gravity)
    if (!this.isGrounded) {
      this.acceleration += Math.min(.3, delta);
      this.velocity.y += -9.8 * this.acceleration; // Apply gravity
    }
    const verticalMovement = new THREE.Vector3(0, this.velocity.y * Math.min(.3, delta), 0);

    // Test horizontal movement for collisions
    const proposedHorizontalPosition = this.playerPosition.clone().add(movement);
    if (!this.checkCollisions(proposedHorizontalPosition)) {
      this.playerPosition.add(movement); // Apply horizontal movement if no collision
    }

    this.camera.position.copy(this.playerPosition);

    // View bobbing effect
    if (this.joystickData.AnyMovement() && !this.joystickData.up) {
      this.viewBobPhase += delta * 10; // Adjust bobbing speed
      this.camera.position.y += Math.sin(this.viewBobPhase) * 0.15; // Bobbing amplitude, the 2 is the player's height and its only temporary, sice you will be able to go up later
    } else {
      this.viewBobPhase = 0; // Reset view bobbing phase when not moving
    }

    // Test vertical movement for collisions
    const proposedVerticalPosition = this.playerPosition.clone().add(new THREE.Vector3(0, verticalMovement.y, 0));
    if (!this.checkCollisions(proposedVerticalPosition)) {
      this.playerPosition.add(verticalMovement); // Apply vertical movement if no collision
      this.isGrounded = false;
    } else {
      this.velocity.y = 0; // Stop vertical velocity
      this.isGrounded = true;
      this.acceleration = 0;
    }

    // portals:
    const portals = this.scene.children
      .filter((child) => child.name.includes('feature Portal'))

    // check distance and if portal is close teleport player to the target level
    const playerBox = new THREE.Box3().setFromCenterAndSize(
      this.playerPosition,
      new THREE.Vector3(.75, 2, .75) // Collider size
    );
    for (const portal of portals) {


      // check distance for any size of portal
      if (playerBox.intersectsBox(new THREE.Box3().setFromObject(portal))) {
        this.stopped = true;
        console.log('teleporting to ', portal.userData.destination);
        //this.playerPosition = new THREE.Vector3(-8, 0.5, 7);

        // use react router to change the level
        this.playerPosition = new THREE.Vector3(0, 3, 0);
        this.navigate(portal.userData.destination || '/');
        window.location.reload();
      }
    }
  }

  private checkCollisions(newPosition: THREE.Vector3): boolean {
    newPosition.y -= .75; // The camera is at the player's head
    // Create a box at the new position
    const playerBox = new THREE.Box3().setFromCenterAndSize(
      newPosition,
      new THREE.Vector3(.75, 2, .75) // Collider size
    );

    const obstacles = this.scene.children
      .filter((child) => child.name.includes('block'))
      .map((obstacle) => new THREE.Box3().setFromObject(obstacle));


    // Check for intersections with collidable objects
    for (const object of obstacles) {
      //const objectBox = new THREE.Box3().setFromObject(object);
      if (playerBox.intersectsBox(object))
        return true;
    }
    return false;
  }

  public savePlayerPosition() {
    const levelId = this.scene.userData.level.levelId;
    console.log("saving player position " + levelId);
    localStorage.setItem("playerPosition" + levelId, JSON.stringify(this.playerPosition.clone().sub(this.scene.position)));
  }

  public loadPlayerPosition() {
    const levelId = this.scene.userData.level.levelId;
    let playerPosition = localStorage.getItem("playerPosition" + levelId);
    if (playerPosition) {
      playerPosition = JSON.parse(playerPosition);
      // @ts-expect-error error fr 
      this.playerPosition = new THREE.Vector3(parseFloat(playerPosition?.x), parseFloat(playerPosition?.y), parseFloat(playerPosition?.z)).add(this.scene.position);
    }
  }

  public joystickData: JoystickOutputData = new JoystickOutputData();

  public SetJoystickData(joystickData: JoystickOutputData | null) {
    this.joystickData = joystickData ?? new JoystickOutputData();
  }
}
