import { Hero } from "./i-heroes";

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  goldShards: number;
  heroList: Hero[];
}
