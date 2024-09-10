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
  partyArray:Hero[]=[]
  partyLevel:number=0

  constructor(
    private appSvc: AppService
  ) {}

ngOnInit(): void {
  this.appSvc.getBgs().subscribe((data) => {
    this.bgs = data
  })
  this.appSvc.getHeroes().subscribe((data) => {
    this.heroes = data.sort((a,b) => a.level - b.level)
    for (let index = 0; index < this.heroes.length; index++) {
      const element = this.heroes[index];
      console.log(element.user);

    }
  })
  this.appSvc.getMonsters().subscribe((data) => {
    this.monsters = data
  })
  this.appSvc.getItems().subscribe((data) => {
    this.items = data
  })

}

combat() {
  if (this.partyArray.length>0 && this.selectedMonster) {
    this.isCombat=true
    while (this.partyArray.length>0 && this.selectedMonster.hitPoints>0) {
      for (let h = 0; h < this.partyArray.length; h++) {
        const hero = this.partyArray[h];
        for (let i = 0; i < hero.itemList.length; i++) {
          const item = hero.itemList[i];
          this.attBonus+=item.attack
          this.defBonus+=item.defence
        }
        switch (hero.type) {
          case HeroClass.FIGHTER:
            this.fight(hero)
            break
          case HeroClass.MAGE:
            this.cast(hero)
            break
          case HeroClass.HEALER:
            this.heal(hero)
            break
          case HeroClass.ARCHER:
            this.shoot(hero)
            break
        }
          console.log(this.selectedMonster.hitPoints);
        if (this.selectedMonster.hitPoints<=0) {
          this.selectedMonster.hitPoints=0
          this.xpLoot=this.selectedMonster.level*100
          this.shardsLoot=Math.floor((this.selectedMonster.level*0.75)*10+(this.selectedMonster.level*Math.floor(Math.random()*6)))
          const hero = this.partyArray[h];
          hero.user.goldShards+=this.shardsLoot
          hero.xp+=this.xpLoot
          for (let i = 0; i < 20; i++) {
            if (hero.xp>=Math.pow(2,i)*1000) {
              this.levelUp=i+2
              hero.level=this.levelUp}
          }
          this.combatExit=`${this.selectedMonster.name} è morto`
        }
      }

      if (this.selectedMonster.hitPoints>0 && this.partyArray.length>0) {
        for (let h = 0; h < this.partyArray.length; h++) {
          const hero = this.partyArray[h]
          hero.hitPoints-=Math.max(0, (Math.floor(this.selectedMonster.attack/this.partyArray.length)+Math.floor(Math.random() * 7)) - (hero.defence+this.defBonus+Math.floor(Math.random() * 7)))
          console.log(hero.name + hero.hitPoints);
          if (hero.hitPoints<=0) {
            hero.hitPoints=0
            this.appSvc.updateHero(hero.id!, hero).subscribe({
              next: () => console.log('Update successful'),
              error: (err) => {
                console.error('Update failed', err);
                console.log(this.selectedHero);
                alert(`Error: ${err.message || 'Unknown error'}`);
              }
            })
            this.partyArray.splice(h,1)
            this.combatExit+=`${hero.name} è morto`
            console.log(this.partyArray);
          }
          }
        }
    }
  }

    for (let h = 0; h < this.partyArray.length; h++) {
      const hero = this.partyArray[h];
      if (hero!=undefined) {
        this.appSvc.updateHero(hero.id!, hero).subscribe({
          next: () => console.log('Update successful'),
          error: (err) => {
            console.error('Update failed', err);
            console.log(this.selectedHero);
            alert(`Error: ${err.message || 'Unknown error'}`);
          }
        });
      }
      this.appSvc.updateUser(hero.user.id!, hero.user).subscribe({
        next: () => console.log('Update successful'),
        error: (err) => {
          console.error('Update failed', err);
          alert(`Error: ${err.message || 'Unknown error'}`);
        }
      });
    }

    this.partyArray=[]

  }


checkHero(event: any, hero: Hero) {
  if (event.target.checked) {
    this.checkedHero=hero;
  } else {
    this.checkedHero = undefined
  }
}

selectHero() {
if (this.checkedHero){
  if (this.partyArray.length<3){
this.partyArray.push(this.checkedHero)
this.partyLevel+=this.checkedHero.level
} else {
this.partyArray.unshift(this.checkedHero)
this.partyLevel+=this.checkedHero.level
let deleteHero = this.partyArray.pop()
this.partyLevel-=deleteHero!.level
}
}
  console.log(this.partyLevel);

this.leveledMonsters=[]
for (let i = 0; i < this.monsters.length; i++) {
  const mon = this.monsters[i];
  if (mon.level>this.partyLevel-3 && mon.level<this.partyLevel+3) {
      this.leveledMonsters.push(mon)
  }
}
this.selectedMonster=this.leveledMonsters[Math.floor(Math.random()*this.leveledMonsters.length)]
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

heal(healer:Hero) {
  for (let h = 0; h < this.partyArray.length; h++) {
    const hero = this.partyArray[h];
    hero.hitPoints+=healer.attack/2
  }
}

fight(fighter:Hero) {
  if (this.selectedMonster) {
    this.selectedMonster.hitPoints-=Math.max(0,(fighter.attack+this.attBonus+Math.floor(Math.random() * 7)) - (Math.floor(this.selectedMonster.defence/this.partyArray.length)+Math.floor(Math.random() * 7)))
  }
}

shoot(archer:Hero) {
  if (this.selectedMonster) {
    this.selectedMonster.hitPoints-=Math.max(0,(archer.attack+this.attBonus+Math.floor(Math.random() * 7)) - (Math.floor(this.selectedMonster.defence/this.partyArray.length)+Math.floor(Math.random() * 7)))
  }
}

cast(mage:Hero) {
  if (this.selectedMonster) {
    this.selectedMonster.hitPoints-=Math.max(0,(mage.attack+this.attBonus+Math.floor(Math.random() * 7)) - (Math.floor(this.selectedMonster.defence/this.partyArray.length)+Math.floor(Math.random() * 7)))
  }
}

}
