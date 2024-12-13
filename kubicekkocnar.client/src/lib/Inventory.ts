import { Item } from "../types/Item";
import { Coinage } from "../types/Coinage";

export class Inventory {

  public items : Item[] = [];
  public coins : Coinage[] = [];

  public GetSelectedItem() : Item | null
  {
    return {
      img: "fr",
      imgUsed: "frr"
    }
  }

}