import { Item } from "../types/Item";
import { Coinage } from "../types/Coinage";
import { ItemUpgrade } from "../types/ItemUpgrade";
import { Cost } from "../types/Cost";
import { GetCoinages } from "../api/Coinages";
import { GetUpgrades } from "../api/Upgrades";

const demoItem : Item = {
  name: "item1",
  description: "i1",
  img: "/Fr.png",
  imgUsed: "/Fr1.png",
}

const emptyItem : Item = {
  img: "/Fr.png",
  imgUsed: "/Fr1.png",
}

export class Inventory {

  constructor()
  {
    this.initializeServerUpgrades();
    this.initializeServerCoinages();
  }

  async initializeServerCoinages() {
    this.coinage = await GetCoinages();
    this.coinageAmount = new Array(this.coinage.length).fill(0);
  }

  async initializeServerUpgrades() {
    this.upgrades = await GetUpgrades();
  }

  public selectedItem : Item | null = demoItem;
  public hotbar : Item[] = [demoItem, emptyItem];

  public AddItemIntoHotbar(item : Item)
  {
    this.hotbar.push(item);
    
    console.log("added item into hotbar " + item.name);
    console.log(this.hotbar);
  }

  public Clone() : Inventory
  {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  public RemoveItemFromHotbar(item : Item)
  {
    this.hotbar = this.hotbar.filter((a) => a.name != item.name);
  }

  public upgrades : ItemUpgrade[] = []

  public selectedItemId : number = 0;

  public coinage : Coinage[] = [];
  public coinageAmount : number[] = [0, 0];

  public addToCoinage(coinage: string, amount : number) {
    for (let i = 0; i < this.coinage.length; i++) {
      if (this.coinage[i].name == coinage) {
        this.coinageAmount[i] += amount;
        return;
      }
    }
  }

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

  public ItemIsInHotbar(item : Item) : boolean
  {
    for (let i = 0; i < this.hotbar.length; i++)
    {
      if (this.hotbar[i].name == item.name) return true;
    }

    return false;
  }

}