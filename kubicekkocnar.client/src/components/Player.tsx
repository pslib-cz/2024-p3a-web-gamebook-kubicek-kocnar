import { useRef, useState, useEffect, MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type KeysState = {
  KeyW: boolean;
  KeyA: boolean;
  KeyS: boolean;
  KeyD: boolean;
  Space: boolean;
};

function Player() {
  const playerRef: MutableRefObject<THREE.Mesh | null> = useRef(null);
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
    if (keys.KeyW) player.position.z -= speed;
    if (keys.KeyS) player.position.z += speed;
    if (keys.KeyA) player.position.x -= speed;
    if (keys.KeyD) player.position.x += speed;
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
    <mesh ref={playerRef} position={[0, 1.5, 0]} name='Player'>
      <boxGeometry args={[0.6, 1.8, 0.6]} />
      <meshStandardMaterial color={0x88ff00} />
    </mesh>
  );
}

export default Player;
