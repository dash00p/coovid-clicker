import config from "../collection/Config.collection.json";
import { IPerk, perkList, perkType } from "../collection/Perk.collection";
import { gameInstance } from "./Game";
import { clickerInstance } from "../logic/Clicker.logic";
import { log } from "../helper/Console.helper";

class Perk {
    activePerks: IPerk[];

    constructor() {
        this.activePerks = [];
        this.routine();
    }

    routine(): void {
        const min: number = config.game.perk.minTimer;
        const max: number = config.game.perk.maxTimer;
        const timer: number = Math.floor(Math.random() * (max - min)) + min;

        setTimeout(() => {
            this.selectRandomBonus();
            this.routine();
        }, 10000/*timer*/);
    }

    selectRandomBonus(): void {
        const availablePerks: IPerk[] = perkList.filter(p => p.requiredLevel <= gameInstance().level);
        const newPerk: IPerk = availablePerks[Math.floor(Math.random() * availablePerks.length)];
        const id: number = +new Date();
        this.activePerks.push({
            id,
            ...newPerk
        });
        this.applyBonus();
        log(`New perk applied : ${newPerk.name}`, 1);
        setTimeout(() => {
            this.activePerks.splice(this.activePerks.findIndex(p => p.id === id), 1);
            log(`Perk unapplied : ${newPerk.name}`, 1);

            this.applyBonus();
        }, newPerk.duration);
    }

    applyBonus(): void {
        let clickerValue: number = clickerInstance().baseIncrement;
        for (const perk of this.activePerks) {
            switch (perk.type) {
                case perkType.clickMultiplicator:
                    clickerValue *= perk.value;
                    break;
                case perkType.clickAddFixedValue:
                    clickerValue += perk.value;
                    break;
            }
        }
        clickerInstance().value = clickerValue;
    }
}

export default Perk;