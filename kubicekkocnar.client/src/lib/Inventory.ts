import { Item } from "../types/Item";
import { Coinage } from "../types/Coinage";
import { ItemUpgrade } from "../types/ItemUpgrade";
import { Cost } from "../types/Cost";

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

  constructor()
  {
    this.initializeServerUpgrades();
  }

  async initializeServerUpgrades() {

    console.log("UPGRADES INITIALIZED");

    try {
        const blocksResponse = await fetch('https://localhost:7097/api/ItemUpgrades');
        if (!blocksResponse.ok) {
            throw new Error(`Response status: ${blocksResponse.status}`);
        }
        this.upgrades = (await blocksResponse.json());

        console.log(this.upgrades);
        
    } catch (err: unknown) {
        console.error(err);
    }
}

  public selectedItem : Item | null = demoItem;
  public hotbar : Item[] = [demoItem, emptyItem];

  public upgrades : ItemUpgrade[] = []

  private selectedItemId : number = 0;

  public coinage : Coinage[] = [{name: "primary"}, {name: "secondary"}];
  public coinageAmount : number[] = [0, 0];

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

  public IsCostSufficient(cost : Cost[]) : boolean
  {    
    if (cost == null) return true;

    for (let i = 0; i < cost.length; i++)
    {
      for (let j = 0; j < this.coinage.length; j++)
      {
        if (cost[i].coinage.name == this.coinage[j].name)
        {
          if (cost[i].cost > this.coinageAmount[j])
          {
            return false;
          }
        }
      }
    }

    return true;

  }

}