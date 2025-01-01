import { Item } from "../types/Item";
import { Coinage } from "../types/Coinage";
import { ItemUpgrade } from "../types/ItemUpgrade";

const demoItem : Item = {
  img: "/Fr.png",
  imgUsed: "/Fr1.png",
}

const demoItem1 : Item = {
  img: "/Fr.png",
  imgUsed: "/",
}

const emptyItem : Item = {
  img: "/",
  imgUsed: "/",
}

export class Inventory {

  public selectedItem : Item | null = demoItem;
  public hotbar : Item[] = [demoItem, emptyItem];

  public upgrades : ItemUpgrade[] = [
    {
      inputItem: demoItem,
      outputItem: demoItem1,
      description: "This is insane upgrade 123",
      cost: [
        {
          coinage: {name: "primary"}, 
          cost: 1
        }
      ]

    }
  ]

  private selectedItemId : number = 0;

  public coinage : Coinage[] = [{name: "primary"}, {name: "secondary"}];

  public Scroll(up : boolean)
  {
    if (this.hotbar.length == 0)
    {
      this.selectedItem = null;
      return;
    }

    if (up) this.selectedItemId++;
    else this.selectedItemId--;

    if (this.selectedItemId > this.hotbar.length - 1) this.selectedItemId = 0;
    else if (this.selectedItemId < 0) this.selectedItemId = this.hotbar.length - 1;

    this.selectedItem = this.hotbar[this.selectedItemId];
  }
}