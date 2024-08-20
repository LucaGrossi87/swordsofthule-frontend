import { BattlegroundType } from "./battlegroundType";

export interface Battleground {
  id?:number;
  name:string;
  type:BattlegroundType;
}
