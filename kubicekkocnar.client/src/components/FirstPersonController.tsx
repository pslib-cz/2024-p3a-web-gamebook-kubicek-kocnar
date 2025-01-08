import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FirstPersonController } from "../lib/FirstPersonController";
import { ItemsController } from "../lib/ItemsController";
import { Inventory } from "../lib/Inventory";
import { AppContext } from "./AppContextProvider";
import { useContext } from "react";
import { getHandlePlayerMouseClick } from "./ItemController";

type FirstPersonControllerComponentProps = {
  camera: THREE.Camera;
  scene: THREE.Scene;
  navigate: (levelId: string) => void;
};

const FirstPersonControllerComponent = ({ camera, scene, navigate}: FirstPersonControllerComponentProps) => {
  
  const { setPlayerInventory } = useContext(AppContext);

  const controllerRef = useRef<FirstPersonController | null>(null);
  const itemsControllerRef = useRef<ItemsController | null>(null);
  const inventory = useRef<Inventory | null>(null);

  const { gl } = useThree();
  const clock = new THREE.Clock();

  useEffect(() => {
    const controller = new FirstPersonController(camera, scene, navigate);
    controllerRef.current = controller;

    itemsControllerRef.current = new ItemsController(camera, scene);

    inventory.current = new Inventory();
    setPlayerInventory(inventory.current);

    const handleMouseMove = (event: MouseEvent) => controller.handleMouseMove(event);
    const handleKeyDown = (event: KeyboardEvent) => controller.handleKeyDown(event);
    const handleKeyUp = (event: KeyboardEvent) => controller.handleKeyUp(event);
    const handleTouchStart = (event: TouchEvent) => controller.handleTouchStart(event);
    const handleTouchMove = (event: TouchEvent) => controller.handleTouchMove(event);

    //gl.domElement.addEventListener("pointerlockchange", handlePointerLockChange);
    document.getElementById("gameroot")?.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      //gl.domElement.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.getElementById("gameroot")?.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl, scene, setPlayerInventory]);

  useFrame(() => {
    controllerRef.current?.update(clock.getDelta());
  });
  
  const handleClick = async () => {
    console.log(!document.getElementById("inventoryui"), window.innerHeight !== screen.height)
    if (window.innerHeight !== screen.height || !document.getElementById("inventoryui")) {
      try { await document.getElementById("gameroot")?.requestFullscreen() } catch (e) { console.error(e); }
      console.log("Requesting Pointerlock");
      await document.getElementById("gameroot")?.requestPointerLock(); 
    }   

    const item = inventory.current? inventory.current.selectedItem : null;

    if (getHandlePlayerMouseClick) getHandlePlayerMouseClick()(item);

    console.log("Calling OnPointerDown");
    
    itemsControllerRef.current?.onCLick();
  };

  document.getElementById("gameroot")!.onpointerdown = handleClick;

  return null;
};

export default FirstPersonControllerComponent;