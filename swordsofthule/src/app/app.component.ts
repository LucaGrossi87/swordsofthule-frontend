import { Component, OnInit } from '@angular/core';
import { Battleground } from './models/i-battlegrounds';
import { AppService } from './app.service';
import { Hero} from './models/i-heroes';
import { Monster } from './models/i-monsters';
import { HeroRace } from './models/heroRace';
import { HeroClass } from './models/heroClass';
import { Item } from './models/i-items';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  bgs: Battleground[]=[];
  heroes: Hero[]=[];
  monsters: Monster[]=[];
  items: Item[]=[];
  selectedHero:Hero | undefined
  checkedHero:Hero | undefined
  selectedMonster:Monster | undefined
  isCombat:boolean = false
  combatExit:String=''
  xpLoot:number=0
  shardsLoot:number=0
  levelUp:number=0
  leveledMonsters: Monster[]=[]
  attBonus:number=0
  defBonus:number=0

  constructor(
    private appSvc: AppService
  ) {}

ngOnInit(): void {
  this.appSvc.getBgs().subscribe((data) => {
    this.bgs = data
  })
  this.appSvc.getHeroes().subscribe((data) => {
    this.heroes = data.sort((a,b) => a.level - b.level)
    console.log(this.heroes);

  })
  this.appSvc.getMonsters().subscribe((data) => {
    this.monsters = data
  })
  this.appSvc.getItems().subscribe((data) => {
    this.items = data
  })

}

combat() {
  if (this.selectedHero!=undefined && this.selectedMonster) {
    this.isCombat=true
    for (let i = 0; i < this.selectedHero.itemList.length; i++) {
      const item = this.selectedHero.itemList[i];
      this.attBonus+=item.attack
      this.defBonus+=item.defence
    }
    while (this.selectedHero.hitPoints>0 && this.selectedMonster.hitPoints>0) {
      this.selectedMonster.hitPoints-=Math.max(0,(this.selectedHero.attack+this.attBonus+Math.floor(Math.random() * 7)) - (this.selectedMonster.defence+Math.floor(Math.random() * 7)))
      console.log(this.selectedMonster.hitPoints);
      if (this.selectedMonster.hitPoints>0) {
        console.log(this.selectedHero.hitPoints);
        this.selectedHero.hitPoints-=Math.max(0, (this.selectedMonster.attack+Math.floor(Math.random() * 7)) - (this.selectedHero.defence+this.defBonus+Math.floor(Math.random() * 7)))
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
      this.selectedHero.user.goldShards+=this.shardsLoot
      this.selectedHero.xp+=this.xpLoot
      for (let i = 0; i < 20; i++) {
        if (this.selectedHero.xp>=Math.pow(2,i)*1000) {
          this.levelUp=i+2
          this.selectedHero.level=this.levelUp}
      }
      this.combatExit=`${this.selectedMonster.name} è morto`
    }

    console.log(this.selectedHero);

    this.appSvc.updateHero(this.selectedHero.id!, this.selectedHero).subscribe({
      next: () => console.log('Update successful'),
      error: (err) => {
        console.error('Update failed', err);
        console.log(this.selectedHero);
        alert(`Error: ${err.message || 'Unknown error'}`);
      }
    });

    this.appSvc.updateUser(this.selectedHero.user.id!, this.selectedHero.user).subscribe({
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

buy(item: Item) {
  if (this.selectedHero!=undefined) {
      this.selectedHero.user.goldShards-=item.price
      this.selectedHero.itemList.push(item)
      console.log(this.selectedHero);

      this.appSvc.updateHero(this.selectedHero.id!, this.selectedHero).subscribe({
        next: () => console.log('Update successful'),
        error: (err) => {
          console.error('Update failed', err);
          alert(`Error: ${err.message || 'Unknown error'}`);
        }
      });

      this.appSvc.updateUser(this.selectedHero.user.id!, this.selectedHero.user).subscribe({
        next: () => console.log('Update successful'),
        error: (err) => {
          console.error('Update failed', err);
          alert(`Error: ${err.message || 'Unknown error'}`);
        }
      });
    }
}
}
