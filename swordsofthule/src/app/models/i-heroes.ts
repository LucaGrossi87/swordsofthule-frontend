import { HeroClass } from "./heroClass";
import { HeroRace } from "./heroRace";
import { Item } from "./i-items";
import { User } from "./i-users";

export interface Hero {
    id?:number;
    name:String;
    level:number;
    attack:number;
    defence: number;
    hitPoints:number;
    race:HeroRace;
    type:HeroClass;
    xp:number;
    itemList: Item[];
    user:User;
}
