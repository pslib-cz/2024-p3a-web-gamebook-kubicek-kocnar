import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FirstPersonController } from "../lib/FirstPersonController";
import { ItemsController } from "../lib/ItemsController";
import { Inventory } from "../lib/Inventory";
import { Item } from "../types/Item";
import { AppContext } from "./AppContextProvider";
import { useContext } from "react";

type FirstPersonControllerComponentProps = {
  camera: THREE.Camera;
  scene: THREE.Scene;
  onPointerDown : () => (item : Item | null) => void | null;
};

const FirstPersonControllerComponent = ({ camera, scene, onPointerDown}: FirstPersonControllerComponentProps) => {
 

  const { playerInventory } = useContext(AppContext);

  const controllerRef = useRef<FirstPersonController | null>(null);
  const itemsControllerRef = useRef<ItemsController | null>(null);
  const inventory = useRef<Inventory | null>(null);

  const { gl } = useThree();
  const clock = new THREE.Clock()

  useEffect(() => {
    const controller = new FirstPersonController(camera, scene);
    controllerRef.current = controller;

    itemsControllerRef.current = new ItemsController(camera, scene);

    inventory.current = new Inventory();

    playerInventory.current = inventory.current;

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
  }, [camera, gl, scene]);

  useFrame(() => {
    controllerRef.current?.update(clock.getDelta());
  });
  
  const handleClick = () => {
    gl.domElement.requestPointerLock(); // Use the canvas element for pointer locking

    const item = inventory.current? inventory.current.GetSelectedItem() : null;

    if (onPointerDown) onPointerDown()(item);

    console.log("Calling OnPointerDown");
    //console.log(onPointerDown(null));

    itemsControllerRef.current?.onCLick();
  };

  gl.domElement.onpointerdown = handleClick;

  return null;
};

export default FirstPersonControllerComponent;