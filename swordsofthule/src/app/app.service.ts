import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';
import { Battleground } from './models/i-battlegrounds';

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
}
