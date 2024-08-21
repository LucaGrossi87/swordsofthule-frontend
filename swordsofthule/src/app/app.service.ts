import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';
import { Battleground } from './models/i-battlegrounds';
import { Hero } from './models/i-heroes';
import { Monster } from './models/i-monsters';

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

  getBg(): Observable<Battleground[]>{
    return this.http.get<Battleground[]>(this.bgUrl);
  }

  getHero(): Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroUrl);
  }

  getMonster(): Observable<Monster[]>{
    return this.http.get<Monster[]>(this.monsterUrl);
  }

  updateHero(id:number, hero:Hero): Observable<void> {
      return this.http.put<void>(`${this.heroUrl}/${id}`, hero)
  }
}
