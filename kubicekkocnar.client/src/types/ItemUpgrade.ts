import { Cost } from "./Cost";
import { Item } from "./Item";

export interface ItemUpgrade{
  itemUpgradeId: number,
  inputItem: Item,
  outputItem: Item,
  description: string,
  cost: Cost[]
}