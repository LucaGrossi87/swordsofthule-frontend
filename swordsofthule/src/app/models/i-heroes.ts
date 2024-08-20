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
    hp:number;
    race:HeroRace;
    class:HeroClass;
    xp:number;
    itemList: Item[];
    user:User;
}
