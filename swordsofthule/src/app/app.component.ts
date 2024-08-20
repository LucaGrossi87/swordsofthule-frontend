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
  isCombat:boolean = false
  combatExit:String=''

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
  this.isCombat=true
  this.selectedHero=this.heroes[0]
  this.selectedMonster=this.monsters[0]
  while (this.selectedHero.hitPoints>0 && this.selectedMonster.hitPoints>0) {
    this.selectedHero.hitPoints=(this.selectedHero.attack+Math.floor(Math.random() * 7)) - (this.selectedMonster.defence+Math.floor(Math.random() * 7))
    this.selectedMonster.hitPoints=(this.selectedMonster.attack+Math.floor(Math.random() * 7)) - (this.selectedHero.defence+Math.floor(Math.random() * 7))
    console.log(this.selectedHero.hitPoints);
    console.log(this.selectedMonster.hitPoints);

  }
  if(this.selectedHero.hitPoints <= 0) {
    this.selectedHero.hitPoints=0
    this.combatExit=`${this.selectedHero.name} è morto`
  } else {
    this.selectedMonster.hitPoints=0
    this.combatExit=`${this.selectedMonster.name} è morto`
  }
}
}
