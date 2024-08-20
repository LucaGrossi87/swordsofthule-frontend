import { ItemType } from "./itemType";

export interface Item {
  id?: number;
  name: string;
  type: ItemType;
  attack: number;
  defence: number;
}
