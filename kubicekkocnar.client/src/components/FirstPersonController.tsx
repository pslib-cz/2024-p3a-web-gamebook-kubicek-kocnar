import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FirstPersonController } from "../lib/FirstPersonController";
import { sobel } from "three/examples/jsm/tsl/display/SobelOperatorNode.js";
import { ItemsController } from "../lib/ItemsController";

type FirstPersonControllerComponentProps = {
  camera: THREE.Camera;
  scene: THREE.Scene;
  onPointerDown : any;
};

const FirstPersonControllerComponent = ({ camera, scene, onPointerDown}: FirstPersonControllerComponentProps) => {
  const controllerRef = useRef<FirstPersonController | null>(null);

  const itemsControllerRef = useRef<ItemsController | null>(null);

  const { gl } = useThree();
  const clock = new THREE.Clock()

  console.log("FirstPersonControllerComponent");

  useEffect(() => {
    const controller = new FirstPersonController(camera, scene);
    controllerRef.current = controller;

    const itemsController = new ItemsController(camera, scene);
    itemsControllerRef.current = itemsController;

    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === gl.domElement;
      controller.handlePointerLockChange(isLocked);
    };

    const handleMouseMove = (event: MouseEvent) => controller.handleMouseMove(event);
    const handleKeyDown = (event: KeyboardEvent) => controller.handleKeyDown(event);
    const handleKeyUp = (event: KeyboardEvent) => controller.handleKeyUp(event);
    const handleTouchStart = (event: TouchEvent) => controller.handleTouchStart(event);
    const handleTouchMove = (event: TouchEvent) => controller.handleTouchMove(event);

    gl.domElement.addEventListener("pointerlockchange", handlePointerLockChange);
    gl.domElement.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      gl.domElement.removeEventListener("pointerlockchange", handlePointerLockChange);
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [camera, gl]);

  useFrame(() => {
    controllerRef.current?.update(clock.getDelta());
  });

  const handleClick = () => {
    gl.domElement.requestPointerLock(); // Use the canvas element for pointer locking
    if (onPointerDown) onPointerDown();

    console.log(itemsControllerRef.current);

    itemsControllerRef.current?.OnCLick();
  };

  gl.domElement.onpointerdown = handleClick;

  return null;
};

export default FirstPersonControllerComponent;
