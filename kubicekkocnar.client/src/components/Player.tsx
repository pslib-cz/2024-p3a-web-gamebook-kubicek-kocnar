import { useRef, useState, useEffect, MutableRefObject, useContext } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AppContext } from './AppContextProvider';
import { Tool } from './editor/ToolBar';

type KeysState = {
  KeyW: boolean;
  KeyA: boolean;
  KeyS: boolean;
  KeyD: boolean;
  Space: boolean;
};

function Player() {
  const { camera } = useThree();
  const playerRef: MutableRefObject<THREE.Mesh | null> = useRef(null);
  const { tool } = useContext(AppContext);
  const [keys, setKeys] = useState<KeysState>({ KeyW: false, KeyA: false, KeyS: false, KeyD: false, Space: false });
  const speed = 0.1;

  // Update keys state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {console.log(e); setKeys((prev) => ({ ...prev, [e.code]: true }))};
    const handleKeyUp = (e: KeyboardEvent) => setKeys((prev) => ({ ...prev, [e.code]: false }));
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Collision detection logic
  const detectCollision = (playerBox: THREE.Box3, obstacles: THREE.Box3[]): boolean => {
    return obstacles.some((obstacle) => playerBox.intersectsBox(obstacle));
  };

  // Handle movement
  useFrame(({ scene }) => {
    const player = playerRef.current;
    if (!player) return;

    const previousPosition = player.position.clone();

    // Movement logic
    if (keys.KeyA) player.rotateY(speed/2);
    if (keys.KeyD) player.rotateY(-speed/2);

    // Move the player forward/backward based on player rotation
    if (keys.KeyW) {
      player.position.add(player.getWorldDirection(new THREE.Vector3()).multiplyScalar(-speed));
    };
    if (keys.KeyS) {
      player.position.add(player.getWorldDirection(new THREE.Vector3()).multiplyScalar(speed));
    };

    if (keys.Space) player.position.y += speed;

    // Collision detection
    const playerBox = new THREE.Box3().setFromObject(player);
    const obstacles = scene.children
      .filter((child) => child.name.includes('block'))
      .map((obstacle) => new THREE.Box3().setFromObject(obstacle));
    
    if (detectCollision(playerBox, obstacles)) {
      player.position.copy(previousPosition); // Revert to the previous position on collision
      //shift the player to the side
    }

    // Update camera position
    if (tool.current === Tool.PlayerCamera) {
      // Cast a ray from the player to the y+2, z+3, if it hits, set the camera position to the hit point
      // Position of of the camera depends on the player's rotation and position
      const cameraPos = new THREE.Vector3(0, 2, 3).applyEuler(player.rotation).add(player.position);

      /*const raycaster = new THREE.Raycaster(player.position, cameraPos, 0, 5);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        camera.position.copy(intersects[0].point);
      } else {*/
        camera.position.copy(cameraPos);
      //´/}
      camera.lookAt(player.position);
    }
  });

  //Gravity
  useFrame(({ scene }) => {
    const player = playerRef.current;
    if (!player) return;

    player.position.y -= 0.05;

    const playerBox = new THREE.Box3().setFromObject(player);
    const obstacles = scene.children
      .filter((child) => child.name.includes('block'))
      .map((obstacle) => new THREE.Box3().setFromObject(obstacle));
    if (detectCollision(playerBox, obstacles)) {
      player.position.y += 0.05;
    }
  });

  return (
    <mesh ref={playerRef} position={[0, 1.5, 0]} name='player'>
      <boxGeometry args={[0.6, 1.8, 0.6]} />
      <meshStandardMaterial color={0x88ff00} />
    </mesh>
  );
}

export default Player;
