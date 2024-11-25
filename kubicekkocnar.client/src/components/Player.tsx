import { useRef, useState, useEffect, MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type KeysState = {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
};

function Player() {
  const playerRef: MutableRefObject<THREE.Mesh | null> = useRef(null);
  const [keys, setKeys] = useState<KeysState>({ w: false, a: false, s: false, d: false });
  const speed = 0.1;

  // Update keys state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys((prev) => ({ ...prev, [e.key]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys((prev) => ({ ...prev, [e.key]: false }));
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
    if (keys.w) player.position.z -= speed;
    if (keys.s) player.position.z += speed;
    if (keys.a) player.position.x -= speed;
    if (keys.d) player.position.x += speed;

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

  return (
    <mesh ref={playerRef} position={[5, 1.001, 0]} name='Player'>
      <boxGeometry args={[0.5, 0.998, 0.5]} />
      <meshStandardMaterial color={0x88ff00} />
    </mesh>
  );
}

export default Player;
