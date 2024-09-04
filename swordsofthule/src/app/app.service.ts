import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';
import { Battleground } from './models/i-battlegrounds';
import { Hero } from './models/i-heroes';
import { Monster } from './models/i-monsters';
import { User } from './models/i-users';
import { Item } from './models/i-items';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private bgUrl = environment.battlegroundUrl;
  private heroUrl = environment.heroUrl;
  private itemUrl = environment.itemUrl;
  private monsterUrl = environment.monsterUrl;
  private userUrl = environment.userUrl;

  constructor(private http: HttpClient) { }

  getBgs(): Observable<Battleground[]>{
    return this.http.get<Battleground[]>(this.bgUrl);
  }

  getHeroes(): Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroUrl);
  }

  getMonsters(): Observable<Monster[]>{
    return this.http.get<Monster[]>(this.monsterUrl);
  }

  getItems(): Observable<Item[]>{
    return this.http.get<Item[]>(this.itemUrl);
  }

  updateHero(id:number, hero:Hero): Observable<void> {
      return this.http.put<void>(`${this.heroUrl}/${id}`, hero)
  }

  updateUser(id:number, user:User): Observable<void> {
      return this.http.put<void>(`${this.userUrl}/${id}`, user)
  }
}
