import React, { useContext, useEffect, useCallback } from "react";
import { OrbitControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { AppContext } from "../AppContextProvider";
import { Tool } from "../editor/ToolBar";
import Level from "../../lib/Level";
import MapEditor from "../../lib/MapEditor";
import FirstPersonControllerComponent from "../FirstPersonController";
import Model from "./Model";
import { CorruptionHandler } from "../CorruptionHandler";
import { useNavigate } from "react-router-dom";

// React.memo(
const Map = ({
  level,
  isEditor = false,
}: {
  level: Level;
  isEditor?: boolean;
}) => {
  const navigate = useNavigate();

  const scene = level.mapRenderer.scene;

  const { toolState, setBlock, addBlockParamsState } = useContext(AppContext);
  const threeRef = React.useRef(useThree());
  const { gl, camera } = threeRef.current;

  console.log("Rerendering MapRenderer");
  
    useFrame(() => {
      level?.enemyRenderer?.update();
    })

  // create a new MapEditor instance and remember it between rerenders
  const mapEditorRef = React.useRef<MapEditor | null>(null);
  if (!mapEditorRef.current) {
    mapEditorRef.current = isEditor ? new MapEditor(level.mapRenderer) : null;
  }
  const mapEditor = mapEditorRef.current;


  // move the cursor cube to the position of the mouse
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      mapEditor?.moveCursorOutline(event, scene, camera, gl);
    },
    [scene, camera, mapEditor, gl]
  );

  const handleMapPointerDown = useCallback(
    (event: MouseEvent) => {
      //get the block that was clicked
      console.log("Pointer down", event);

      const mouse = new THREE.Vector2(0, 0);
      // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster
        .intersectObjects(scene.children)
        .filter((intersect) => intersect.object.name.startsWith("block"));

      if (intersects.length > 0) {
        console.log("Intersected with block", intersects);

        // spawn a ball at the intersection point
        const ballGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.copy(intersects[0].point.sub(scene.position));
        scene.add(ball);
        
        const selectedBlock = level.mapRenderer.blocks.find(
          (block) => block.mesh?.id === intersects[0].object.id
        );
        if (!selectedBlock) return;
        if (!isEditor) return; 
        switch (toolState) {
          case Tool.Mouse: {
            if (selectedBlock) setBlock(selectedBlock);
            scene
              .getObjectByName("selectioncube")
              ?.position.set(
                intersects[0].object.position.x,
                intersects[0].object.position.y,
                intersects[0].object.position.z
              );
            break;
          }
          case Tool.Add: {
            if (intersects[0].face?.normal === undefined) return;
            const newPos = intersects[0].object.position
              .clone()
              .add(intersects[0].face?.normal);
            const newBlock = {
              ...selectedBlock,
              position: newPos,
              placedBlockId: 1000000 + level.mapRenderer.blockCounter++,
            };
            newBlock.position = newPos;
            if (addBlockParamsState) {
              console.log("Adding block with params", addBlockParamsState);
              if (addBlockParamsState.state) {
                newBlock.state = addBlockParamsState.state;
              }
              if (addBlockParamsState.blockId) {
                newBlock.blockId = addBlockParamsState.blockId;
              }
            }
            level.addBlock(newBlock);
            break;
          }
          case Tool.Remove: {
            const block = level.mapRenderer.blocks.find(
              (block) => block.mesh === intersects[0].object
            );
            if (block) {
              level.removeBlock(block);
            }
            break;
          }
        
        }
      }
    },
    [toolState, setBlock, level, scene, camera, addBlockParamsState, isEditor]
  );

  useEffect(() => {
    console.log("Adding event listeners");
    document
      .getElementById("gameroot")
      ?.addEventListener("click", handleMapPointerDown);
    document
      .getElementById("gameroot")
      ?.addEventListener("mousemove", handleMouseMove);
    return () => {
      document
        .getElementById("gameroot")
        ?.removeEventListener("click", handleMapPointerDown);
      document
        .getElementById("gameroot")
        ?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMapPointerDown, handleMouseMove]);

  useEffect(() => {
    console.log("MapRenderer mounted");

    level.blocks.forEach((block) => level.mapRenderer.addBlock(block));
  }, [level.mapRenderer, scene, level]);

  return (
    <>
      {/* GAME ONLY */}
      {!isEditor && (
        <>
          <CorruptionHandler
            allBlocks={level.blocks}
            corruptedBlocks={level.blocks.filter(
              (block) => block.block.attributes[0] == "corrupt"
            )}
          />
          <FirstPersonControllerComponent
            camera={camera}
            scene={scene}
            navigate={(levelId) =>
              navigate(
                `/games/${level.gameId}/levels/${levelId}?source=${level.levelId}`
              )
            }
          />
        </>
      )}

      {/* EDITOR ONLY */}
      {isEditor && (
        <>
          <axesHelper args={[20]} />

          <lineSegments name="cursorcube" position={[0, 1000, 0]} scale={1.001}>
            <edgesGeometry
              attach="geometry"
              args={[new THREE.BoxGeometry(1, 1, 1)]}
            />
            <lineBasicMaterial attach="material" color="white" />
          </lineSegments>

          <lineSegments
            name="selectioncube"
            position={[0, 1000, 0]}
            scale={1.002}
          >
            <edgesGeometry
              attach="geometry"
              args={[new THREE.BoxGeometry(1, 1, 1)]}
            />
            <lineBasicMaterial attach="material" color="yellow" />
          </lineSegments>
          {toolState == Tool.PlayerCamera ? (
            <FirstPersonControllerComponent
              camera={camera}
              scene={scene}
              navigate={(levelId) =>
                navigate(
                  `/games/${level.gameId}/levels/${levelId}?source=${level.levelId}`
                )
              }
            />
          ) : (
            <OrbitControls camera={camera} />
          )}
        </>
      )}

      <Stats className="stats" />
      <Model
        path="/models/crystal.glb"
        position={new THREE.Vector3(-2, 0.5, -1)}
      />
      <Model
        path="/models/crystal.glb"
        position={new THREE.Vector3(-2.6, 3, 0)}
        rotation={new THREE.Euler(0, 0, -Math.PI / 2)}
      />
      <Model
        path="/models/crystal.glb"
        name="portal-5"
        position={new THREE.Vector3(-8, 0.5, 7)}
      />
    </>
  );
  //never rerender :D
}; //); , () => true

export default Map;
