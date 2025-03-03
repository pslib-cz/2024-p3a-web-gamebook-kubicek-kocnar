import SaveHandler from "../SaveHandler";
import { FirstPersonController } from "./FirstPersonController";
import { InteractionsController } from "./InteractionsController";
import { Inventory } from "./Inventory";
import { StoryController } from "./StoryController";
import * as THREE from 'three';

export class Player
{
  public health: number = 100;

  public camera: THREE.Camera;
  public scene: THREE.Scene;

  public inventory : Inventory;
  public controller : FirstPersonController;
  public interactions : InteractionsController;
  public story : StoryController;

  public constructor(camera : THREE.Camera, scene : THREE.Scene, navigate: (levelId: string) => void)
  {
    this.camera = camera;
    this.scene = scene;

    this.inventory = new Inventory();
    this.story = new StoryController();
    this.interactions = new InteractionsController(this);
    this.controller = new FirstPersonController(camera, scene, navigate, this);

    this.createSavingInterval()
  }

  createSavingInterval()
  {
    return setInterval(() => {
      SaveHandler.savePlayer(this);
    }, 1000);
  }

  public Clone() : Player
  {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}