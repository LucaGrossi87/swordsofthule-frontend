import { Component, OnInit } from '@angular/core';
import { Battleground } from './models/i-battlegrounds';
import { AppService } from './app.service';
import { Hero } from './models/i-heroes';
import { Monster } from './models/i-monsters';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  bgs: Battleground[]=[];
  heroes: Hero[]=[];
  monsters: Monster[]=[];
  selectedHero:Hero | undefined
  selectedMonster:Monster | undefined

  constructor(
    private appSvc: AppService
  ) {}

ngOnInit(): void {
  this.appSvc.getBg().subscribe((data) => {
    this.bgs = data
  })
  this.appSvc.getHero().subscribe((data) => {
    this.heroes = data
  })
  this.appSvc.getMonster().subscribe((data) => {
    this.monsters = data
  })
}

combat() {
this.selectedHero=this.heroes[0]
this.selectedMonster=this.monsters[0]

}
}
