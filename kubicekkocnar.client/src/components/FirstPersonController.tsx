import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FirstPersonController } from "../lib/Player/FirstPersonController";
import { AppContext } from "./AppContextProvider";
import { useContext } from "react";
import { getHandlePlayerMouseClick } from "./ItemController";
import { Player } from "../lib/Player/Player";
import { GameContext } from "../contexts/GameContext";

type FirstPersonControllerComponentProps = {
  camera: THREE.Camera;
  scene: THREE.Scene;
  navigate: (levelId: string) => void;
};

const FirstPersonControllerComponent = ({ camera, scene, navigate }: FirstPersonControllerComponentProps) => {
  const { setPlayer, player, joytickData } = useContext(AppContext);
  const { playerHealth } = useContext(GameContext);
  
  /// this is necessary for interactions
  const playerRef = useRef<Player | null>(null);
  
  const { gl } = useThree();
  const clock = new THREE.Clock();
  
  useEffect(() => {
    if (player) {
      player?.controller.SetJoystickData(joytickData);
    }
  }, [joytickData]);

  useEffect(() => {
    const _player = new Player(
      camera, scene, new FirstPersonController(camera, scene, navigate),
    )

    _player.controller.loadPlayerPosition();

    playerRef.current = _player;
    setPlayer(_player);

    const handleMouseMove = (event: MouseEvent) => _player.controller.handleMouseMove(event);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") 
        document.exitPointerLock();
      if (event.key === "x") 
        window.location.replace(window.location + "/editor");
      
      _player.controller.handleKeyDown(event);
    }
    const handleKeyUp = (event: KeyboardEvent) => _player.controller.handleKeyUp(event);
    const handleTouchStart = (event: TouchEvent) => _player.controller.handleTouchStart(event);
    const handleTouchMove = (event: TouchEvent) => _player.controller.handleTouchMove(event);

    document.getElementById("gameroot")?.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.getElementById("gameroot")!.addEventListener("pointerdown", handleClick)

    return () => {
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
    player?.controller.update(clock.getDelta());

    if (playerHealth <= 0) console.error("Player died");

    if (!player) throw new Error("Player not set");
  });

  const handleClick = async () => {
    if (!document.getElementById("inventoryui")) {
      try { await document.getElementById("gameroot")?.requestFullscreen() } catch (e) { console.error(e); }
      await document.getElementById("gameroot")?.requestPointerLock();
    }

    const item = player ? player.inventory.selectedItem : null;

    if (getHandlePlayerMouseClick) getHandlePlayerMouseClick()(item);

    playerRef.current?.interactions.onCLick();
  };

  return null;
};

export default FirstPersonControllerComponent;