import config from "./Config.logic";
import { perkList } from "../collection/Perk.collection";
import { gameInstance } from "./Game.logic";
import { clickerInstance } from "../logic/Clicker.logic";
import { log, logWithTimer } from "../helper/Console.helper";
import EphemeralComponent from "../component/Ephemeral.component";
import DomHandler from "./DomHandler";
import { buildInstance } from "./Building.logic";
import { commarize } from "../helper/Dom.helper";
import { bonusInstance } from "./Bonus.logic";

class Perk {
  private static _instance: Perk;
  _activePerks: IPerk[];
  _jobs: number[];

  constructor() {
    if (Perk._instance) {
      return Perk._instance;
    }
    Perk._instance = this;
    this._activePerks = [];
    this._jobs = [];
    this.routine();
  }

  get activePerks(): IPerk[] {
    return this._activePerks;
  }

  set activePerks(newVal: IPerk[]) {
    this._activePerks = newVal;
  }

  routine(): void {
    const min: number =
      config.game.perk.minTimer / (bonusInstance()?.perkTimerReducer || 1);
    const max: number =
      config.game.perk.maxTimer / (bonusInstance()?.perkTimerReducer || 1);
    const timer: number = Math.floor(Math.random() * (max - min)) + min;

    setTimeout(() => {
      this.createEphemeral();
      this.routine();
    }, timer);
  }

  createEphemeral(): void {
    new EphemeralComponent({
      icon: "wow",
      event: memeEventType.perk,
      duration: config.game.perk.duration,
      handleClick: this.selectRandomPerk,
      context: this,
      killOnClick: true,
    });
  }

  selectRandomPerk(): any {
    const availablePerks: IPerk[] = perkList.filter(
      (p) => p.requiredLevel <= gameInstance().level
    );
    const newPerk: IPerk =
      availablePerks[Math.floor(Math.random() * availablePerks.length)];
    const id: number = +new Date();
    const duration: number =
      newPerk.duration * bonusInstance().perkEffectMultiplicator;
    this.activePerks.push({
      ...newPerk,
      duration,
      id,
    });
    this.applyPassivePerk();
    this.applyActivePerk();
    // must be render after apply perk to render the proper name.
    DomHandler.renderPerk(this.activePerks.find((p) => p.id === id));

    logWithTimer(`New perk applied : ${newPerk.name}`, 1);
    setTimeout(() => {
      const index: number = this.activePerks.findIndex((p) => p.id === id);
      if (index < 0) return;
      this.activePerks.splice(index, 1);
      this.activePerks = [...this.activePerks];
      logWithTimer(`Perk unapplied : ${newPerk.name}`, 1);
      this.applyPassivePerk();
      this.applyActivePerk();
    }, duration);
  }

  // perk that do not imply user interaction.
  applyPassivePerk(): void {
    let productionMultiplicator: number = 1;
    for (const perk of this.activePerks
      .filter((p) => !p.isActive && !p.isApplied)
      .sort((a, b) => a.order - b.order)) {
      switch (perk.type) {
        case perkType.productionMultiplicator:
          productionMultiplicator *= perk.value;
          break;
        case perkType.clickAuto:
          const perkValue: number =
            perk.value * bonusInstance().autoClickMultiplicator;
          const instance: any = DomHandler.clicker;
          let intervalId: number = instance.setInterval(() => {
            DomHandler.clicker.handleClick();
          }, 1000 / perkValue);
          this._jobs.push(intervalId);
          setTimeout(() => {
            const jobIndex = this._jobs.indexOf(intervalId);
            if (jobIndex > -1) {
              this._jobs.splice(jobIndex, 1);
            }
            clearInterval(intervalId);
          }, perk.duration);
          perk.name += ` (${perkValue}/s)`;
          perk.isApplied = true;
          break;
        case perkType.fortuneGift:
          const perkAmount: number = Math.trunc(
            gameInstance().currentAmount / 10
          );
          logWithTimer(
            `Applying fortune gift (+${commarize(
              perkAmount
            )}). Old bank value: ${commarize(gameInstance().currentAmount)}`,
            1
          );
          gameInstance().currentAmount += perkAmount;
          logWithTimer(
            `New bank value: ${commarize(gameInstance().currentAmount)}`,
            1
          );

          perk.name += ` (+ ${commarize(perkAmount)})`;
          perk.isApplied = true;
          break;
      }
    }
    buildInstance().currentMultiplicator = productionMultiplicator;
  }

  // perk that imply user interaction to be effective.
  applyActivePerk(): void {
    let clickerValue: number = clickerInstance().baseIncrement;
    for (const perk of this.activePerks.filter((p) => p.isActive)) {
      switch (perk.type) {
        case perkType.clickMultiplicator:
          clickerValue *= perk.value;
          break;
        case perkType.clickAddFixedValue:
          // add 10^x to each click. x = 10% of current production (with perk applied)
          const exponent: number = Math.trunc(
            (buildInstance().totalProduction *
              buildInstance().currentMultiplicator) /
              10
          ).toString().length;
          const perkAmount: number = Math.pow(10, exponent);
          clickerValue += perkAmount;
          perk.name += ` (+ ${commarize(perkAmount)} à chaque clic)`;
          break;
      }
    }
    clickerInstance().value = clickerValue;
    DomHandler.clicker.updateIncrement(clickerValue);
  }

  clearActivePerks() {
    this._activePerks = [];
    this.clearActiveJobs();
    this.applyPassivePerk();
    this.applyActivePerk();
    DomHandler.removeAllPerks();
  }

  clearActiveJobs() {
    for (const job of this._jobs) {
      clearInterval(job);
      const jobIndex = this._jobs.indexOf(job);
      if (jobIndex > -1) {
        this._jobs.splice(jobIndex, 1);
      }
    }
  }

  static getInstance(): Perk {
    return Perk._instance;
  }

  static deleteInstance(): void {
    Perk._instance.clearActiveJobs();
    delete Perk._instance;
  }
}

export const perkInstance: () => Perk = (): Perk => {
  return Perk.getInstance();
};

export default Perk;
