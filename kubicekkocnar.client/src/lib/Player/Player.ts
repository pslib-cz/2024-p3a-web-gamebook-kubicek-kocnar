import { FirstPersonController } from "./FirstPersonController";
import { InteractionsController } from "./InteractionsController";
import { Inventory } from "./Inventory";

export class Player
{
  public inventory : Inventory;
  public controller : FirstPersonController;
  public interactions : InteractionsController;

  public constructor(inv : Inventory, cont : FirstPersonController, inter : InteractionsController)
  {
    this.inventory = inv;
    this.controller = cont;
    this.interactions = inter;
  }

  public Clone() : Player
  {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}