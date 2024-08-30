import { Component, OnInit } from '@angular/core';
import { Battleground } from './models/i-battlegrounds';
import { AppService } from './app.service';
import { Hero} from './models/i-heroes';
import { Monster } from './models/i-monsters';
import { HeroRace } from './models/heroRace';
import { HeroClass } from './models/heroClass';

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
  checkedHero:Hero | undefined
  selectedMonster:Monster | undefined
  isCombat:boolean = false
  combatExit:String=''
  xpLoot:number=0
  shardsLoot:number=0
  levelUp:number=0
  leveledMonsters: Monster[]=[]

  constructor(
    private appSvc: AppService
  ) {}

ngOnInit(): void {
  this.appSvc.getBg().subscribe((data) => {
    this.bgs = data
  })
  this.appSvc.getHero().subscribe((data) => {
    this.heroes = data.sort((a,b) => a.level - b.level)
  })
  this.appSvc.getMonster().subscribe((data) => {
    this.monsters = data
  })

}

combat() {
  if (this.selectedHero!=undefined && this.selectedMonster) {
    this.isCombat=true
    while (this.selectedHero.hitPoints>0 && this.selectedMonster.hitPoints>0) {
      this.selectedMonster.hitPoints-=Math.max(0,(this.selectedHero.attack+Math.floor(Math.random() * 7)) - (this.selectedMonster.defence+Math.floor(Math.random() * 7)))
      console.log(this.selectedMonster.hitPoints);
      if (this.selectedMonster.hitPoints>0) {
        console.log(this.selectedHero.hitPoints);
        this.selectedHero.hitPoints-=Math.max(0, (this.selectedMonster.attack+Math.floor(Math.random() * 7)) - (this.selectedHero.defence+Math.floor(Math.random() * 7)))
        console.log(this.selectedHero.hitPoints);

      }
    }
    if(this.selectedHero.hitPoints <= 0) {
      this.selectedHero.hitPoints=0
      this.combatExit=`${this.selectedHero.name} è morto`
    } else {
      this.selectedMonster.hitPoints=0
      this.xpLoot=this.selectedMonster.level*100
      this.shardsLoot=Math.floor((this.selectedMonster.level*0.75)*10+(this.selectedMonster.level*Math.floor(Math.random()*6)))
      this.selectedHero.goldShards+=this.shardsLoot
      this.selectedHero.xp+=this.xpLoot
      for (let i = 0; i < 20; i++) {
        if (this.selectedHero.xp>=Math.pow(2,i)*1000) {
          this.levelUp=i+2
          this.selectedHero.level=this.levelUp}
      }
      this.combatExit=`${this.selectedMonster.name} è morto`
    }

    this.appSvc.updateHero(this.selectedHero.id!, this.selectedHero).subscribe({
      next: () => console.log('Update successful'),
      error: (err) => {
        console.error('Update failed', err);
        alert(`Error: ${err.message || 'Unknown error'}`);
      }
    });
  }
}

checkHero(event: any, hero: Hero) {
  if (event.target.checked) {
    this.leveledMonsters=[]
    this.checkedHero=hero;
    for (let i = 0; i < this.monsters.length; i++) {
      const mon = this.monsters[i];
      if (mon.level>hero.level-3 && mon.level<hero.level+3) {
          this.leveledMonsters.push(mon)
      }
    }
    this.selectedMonster=this.leveledMonsters[Math.floor(Math.random()*this.leveledMonsters.length)]
  } else {
    this.checkedHero = undefined
  }
}

selectHero() {
this.selectedHero=this.checkedHero;
}
}
