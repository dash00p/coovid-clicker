import config from "../collection/Config.collection.json";
import { IPerk, perkList, perkType } from "../collection/Perk.collection";
import { gameInstance } from "./Game.logic";
import { clickerInstance } from "../logic/Clicker.logic";
import { log } from "../helper/Console.helper";
import EphemeralComponent from "../component/Ephemeral.component";
import { eventType } from "../collection/Memes.collection";
import DomHandler from "./DomHandler";
import { buildInstance } from "./Building.logic";
import { commarize } from "../helper/Dom.helper";

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
        this.applyPassiveBonus();
        this.applyActiveBonus();
        // must be render after apply bonus to render the proper name.
        DomHandler.renderPerk(this.activePerks.find(p => p.id === id));

        log(`New perk applied : ${newPerk.name}`, 1);
        setTimeout(() => {
            this.activePerks.splice(this.activePerks.findIndex(p => p.id === id), 1);
            this.activePerks = [...this.activePerks];
            log(`Perk unapplied : ${newPerk.name}`, 1);
            this.applyPassiveBonus();
            this.applyActiveBonus();
        }, newPerk.duration);
    }

    // bonus that do not imply user interaction.
    applyPassiveBonus(): void {
        let productionMultiplicator:number = 1;
        for (const perk of this.activePerks.filter(p => !p.isActive && !p.isApplied).sort((a, b) => a.order - b.order)) {
            switch (perk.type) {
                case perkType.productionMultiplicator:
                    productionMultiplicator *= perk.value;
                    break;
                case perkType.clickAuto:
                    const instance: any = DomHandler.clicker;
                    let intervalId: number = instance.setInterval(() => {
                        DomHandler.clicker.handleClick();
                    }, 1000 / perk.value);
                    setTimeout(() => { clearInterval(intervalId); }, perk.duration);
                    perk.name += ` (${perk.value}/s)`;
                    perk.isApplied= true;
                    break;
                case perkType.fortuneGift:
                    const perkAmount: number = Math.trunc(gameInstance().currentAmount / 10);
                    gameInstance().currentAmount += perkAmount;
                    perk.name += ` (${commarize(perkAmount)})`;
                    perk.isApplied= true;
                    break;
            }
        }
        buildInstance().currentMultiplicator = productionMultiplicator;
    }

    // bonus that imply user interaction to be effective.
    applyActiveBonus(): void {
        let clickerValue: number = clickerInstance().baseIncrement;
        for (const perk of this.activePerks.filter(p => p.isActive)) {
            switch (perk.type) {
                case perkType.clickMultiplicator:
                    clickerValue *= perk.value;
                    break;
                case perkType.clickAddFixedValue:
                    // add 10^x to each click. x = 10% of current production (with bonus)
                    const exponent: number = (
                        Math.trunc(buildInstance().totalProduction * buildInstance().currentMultiplicator / 10))
                        .toString().length;
                    const perkAmount: number = Math.pow(10, exponent);
                    clickerValue += perkAmount;
                    perk.name += `(+${commarize(perkAmount)})`;
                    break;
            }
        }
        clickerInstance().value = clickerValue;
        DomHandler.clicker.updateIncrement(clickerValue);
    }

    static getInstance(): Perk {
        return Perk._instance;
    }
}

export const perkInstance: () => Perk = (): Perk => {
    return Perk.getInstance();
};

export default Perk;