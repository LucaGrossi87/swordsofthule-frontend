import { MonsterType } from "./monsterType";

export interface Monster {
  id?:number;
  name:String;
  level:number;
  attack:number;
  defence: number;
  hp:number;
  type:MonsterType;
}
