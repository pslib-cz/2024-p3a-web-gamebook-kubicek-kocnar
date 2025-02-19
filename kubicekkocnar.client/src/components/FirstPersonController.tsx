import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FirstPersonController } from "../lib/FirstPersonController";
import { InteractionsController } from "../lib/InteractionsController";
import { Inventory } from "../lib/Inventory";
import { AppContext } from "./AppContextProvider";
import { useContext } from "react";
import { getHandlePlayerMouseClick } from "./ItemController";
import { Player } from "../lib/Player";

type FirstPersonControllerComponentProps = {
  camera: THREE.Camera;
  scene: THREE.Scene;
  navigate: (levelId: string) => void;
};

const FirstPersonControllerComponent = ({ camera, scene, navigate}: FirstPersonControllerComponentProps) => {
   
  const { setPlayer, player, joytickData } = useContext(AppContext);

  const playerRef = useRef<Player | null>(null);

  //const controllerRef = useRef<FirstPersonController | null>(null);
  //const itemsControllerRef = useRef<InteractionsController | null>(null);

  const { gl } = useThree();
  const clock = new THREE.Clock();

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current?.controller.SetJoystickData(joytickData);
    }
  }, [joytickData]);

  useEffect(() => {

    const _player = new Player(
      new Inventory(),
      new FirstPersonController(camera, scene, navigate),
      new InteractionsController(camera, scene)
    )

    _player.controller.loadPlayerPosition();

    setPlayer(_player);

    //itemsControllerRef.current.playerInventory = newInv;
    //console.log("Setting player inventory", newInv, itemsControllerRef.current);   

    const handleMouseMove = (event: MouseEvent) => _player.controller.handleMouseMove(event);
    const handleKeyDown = (event: KeyboardEvent) => _player.controller.handleKeyDown(event);
    const handleKeyUp = (event: KeyboardEvent) => _player.controller.handleKeyUp(event);
    const handleTouchStart = (event: TouchEvent) => _player.controller.handleTouchStart(event);
    const handleTouchMove = (event: TouchEvent) => _player.controller.handleTouchMove(event);

    //gl.domElement.addEventListener("pointerlockchange", handlePointerLockChange);
    document.getElementById("gameroot")?.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.getElementById("gameroot")!.addEventListener("pointerdown", handleClick)

    return () => {
      //gl.domElement.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.getElementById("gameroot")?.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.getElementById("gameroot")!.removeEventListener("pointerdown", handleClick)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, gl, scene, setPlayer]);

  useFrame(() => {
    playerRef.current?.controller.update(clock.getDelta());
    
    if (!playerRef.current) throw new Error("Player not set");
  });

  const handleClick = async () => {
    if (!document.getElementById("inventoryui")) {
      try { await document.getElementById("gameroot")?.requestFullscreen() } catch (e) { console.error(e); }
      console.log("Requesting Pointerlock");
      await document.getElementById("gameroot")?.requestPointerLock();
    }

    const item = player ? player.inventory.selectedItem : null;

    if (getHandlePlayerMouseClick) getHandlePlayerMouseClick()(item);

    console.log("Calling OnPointerDown");

    player?.interactions.onCLick();
  };

  return null;
};

export default FirstPersonControllerComponent;