import { Cost } from "./Cost";
import { Item } from "./Item";

export interface ItemUpgrade{
  inputItem: Item,
  outputItem: Item,
  description: string,
  cost: Cost[]
}