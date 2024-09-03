import { User } from './i-users';
import { HeroClass } from "./heroClass";
import { HeroRace } from "./heroRace";
import { Item } from "./i-items";

export interface Hero {
    id?:number;
    name:string;
    level:number;
    attack:number;
    defence: number;
    hitPoints:number;
    race:HeroRace;
    type:HeroClass;
    xp:number;
    goldShards:number;
    itemList: Item[];
    user: User;
}
