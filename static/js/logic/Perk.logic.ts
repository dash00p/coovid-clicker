import config from "../collection/Config.collection.json";
import { IPerk, perkList, perkType } from "../collection/Perk.collection";
import { gameInstance } from "./Game.logic";
import { clickerInstance } from "../logic/Clicker.logic";
import { log } from "../helper/Console.helper";
import EphemeralComponent from "../component/Ephemeral.component";
import { eventType } from "../collection/Memes.collection";
import DomHandler from "./DomHandler";
import { buildInstance } from "./Building.logic";

class Perk {
    private static _instance: Perk;
    _activePerks: IPerk[];

    constructor() {
        if (Perk._instance) {
            return Perk._instance;
        }
        Perk._instance = this;
        this._activePerks = [];
        this.routine();
    }

    get activePerks(): IPerk[] {
        return this._activePerks;
    }

    set activePerks(newVal: IPerk[]) {
        this._activePerks = newVal;
    }

    routine(): void {
        const min: number = config.game.perk.minTimer;
        const max: number = config.game.perk.maxTimer;
        const timer: number = Math.floor(Math.random() * (max - min)) + min;

        setTimeout(() => {
            // tslint:disable-next-line: no-unused-expression
            new EphemeralComponent({
                icon: "wow",
                event: eventType.perk,
                duration: config.game.perk.duration,
                handleClick: this.selectRandomBonus,
                context: this,
                killOnClick: true
            });
            this.routine();
        }, timer);
    }

    selectRandomBonus(): any {
        const availablePerks: IPerk[] = perkList.filter(p => p.requiredLevel <= gameInstance().level);
        const newPerk: IPerk = availablePerks[Math.floor(Math.random() * availablePerks.length)];
        const id: number = +new Date();
        this.activePerks.push({
            ...newPerk, id
        });
        DomHandler.renderPerk({
            ...newPerk, id
        });

        this.applyPassiveBonus();
        this.applyActiveBonus(newPerk);
        log(`New perk applied : ${newPerk.name}`, 1);
        setTimeout(() => {
            this.activePerks.splice(this.activePerks.findIndex(p => p.id === id), 1);
            this.activePerks = [...this.activePerks];
            log(`Perk unapplied : ${newPerk.name}`, 1);
            this.applyPassiveBonus();
        }, newPerk.duration);
    }

    applyPassiveBonus(): void {
        let clickerValue: number = clickerInstance().baseIncrement;
        let productionMultiplicator: number = 1;
        for (const perk of this.activePerks.filter(p => !p.isActive)) {
            switch (perk.type) {
                case perkType.clickMultiplicator:
                    clickerValue *= perk.value;
                    break;
                case perkType.clickAddFixedValue:
                    clickerValue += perk.value;
                    break;
                case perkType.productionMultiplicator:
                    productionMultiplicator *= perk.value;
                    break;
            }
        }
        buildInstance().currentMultiplicator = productionMultiplicator;
        clickerInstance().value = clickerValue;
        DomHandler.clicker.updateIncrement(clickerValue);
    }

    applyActiveBonus(perk: IPerk): void {
        const instance: any = DomHandler.clicker;
        let intervalId: number;
        switch (perk.type) {
            case perkType.clickAuto:
                intervalId = instance.setInterval(() => {
                    DomHandler.clicker.handleClick();
                }, 1000 / perk.value);
                break;
        }
        setTimeout(() => { clearInterval(intervalId); }, perk.duration);
    }

    static getInstance(): Perk {
        return Perk._instance;
    }
}

export const perkInstance: () => Perk = (): Perk => {
    return Perk.getInstance();
};

export default Perk;