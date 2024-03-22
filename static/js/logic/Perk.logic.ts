import config from "./Config.logic";
import { perkList } from "../collection/Perk.collection";
import { logWithTimer } from "../helper/Console.helper";
import EphemeralComponent from "../component/Ephemeral.component";
import DomHandler from "./DomHandler";
import { commarize } from "../helper/Dom.helper";
import Core from "./core/Core.logic";
import Game from "./Game.logic";
import Building from "./Building.logic";
import Bonus from "./Bonus.logic";
import Clicker from "./Clicker.logic";

class Perk extends Core<Perk> {
  _activePerks: IPerk[];
  _count: number;

  constructor() {
    super();
    this._activePerks = [];
    this._count = 0;
    this.routine();
  }

  /** List of active perks. */
  get activePerks(): IPerk[] {
    return this._activePerks;
  }

  set activePerks(newVal: IPerk[]) {
    this._activePerks = newVal;
  }

  /** Number of perks applied since the beginning of the game. */
  get count(): number {
    return this._count;
  }

  set count(newVal: number) {
    this._count = newVal;
  }

  routine(): void {
    const min: number =
      config.game.perk.minTimer /
      (Bonus.getInstance()?.perkRoutineTimerReducer || 1);
    const max: number =
      config.game.perk.maxTimer /
      (Bonus.getInstance()?.perkRoutineTimerReducer || 1);
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
      (p) => p.requiredLevel <= Game.getInstance().level
    );
    const newPerk: IPerk =
      availablePerks[Math.floor(Math.random() * availablePerks.length)];
    const id: number = +new Date();
    const duration: number =
      newPerk.duration * Bonus.getInstance().perkEffectTimerMultiplicator;
    this.activePerks.push({
      ...newPerk,
      duration,
      id,
    });
    this.applyPassivePerk();
    this.applyActivePerk();
    // must be render after apply perk to render the proper name.
    DomHandler.renderPerk(this.activePerks.find((p) => p.id === id));

    this.count++;

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
            perk.value * Bonus.getInstance().autoClickMultiplicator;
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
            Game.getInstance().currentAmount * perk.value
          );
          logWithTimer(
            `Applying fortune gift (+${commarize(
              perkAmount
            )}). Old bank value: ${commarize(Game.getInstance().currentAmount)}`,
            1
          );
          Game.getInstance().currentAmount += perkAmount;
          logWithTimer(
            `New bank value: ${commarize(Game.getInstance().currentAmount)}`,
            1
          );

          perk.name += ` (+ ${commarize(perkAmount)})`;
          perk.isApplied = true;
          break;
      }
    }
    Building.getInstance().currentMultiplicator = productionMultiplicator;
  }

  // perk that imply user interaction to be effective.
  applyActivePerk(): void {
    let clickerValue: number = Clicker.getInstance().baseIncrement;
    for (const perk of this.activePerks.filter((p) => p.isActive)) {
      switch (perk.type) {
        case perkType.clickMultiplicator:
          const perkValue: number =
            perk.value * Bonus.getInstance().pentaClickMultiplicator;
          clickerValue *= perkValue;
          perk.name = `Super click (x${perkValue})`;
          break;
        case perkType.clickAddFixedValue:
          // add 10^x to each click. x = 10% of current production (with perk applied)
          const exponent: number = Math.trunc(
            (Building.getInstance().totalProduction *
              Building.getInstance().currentMultiplicator) /
            10
          ).toString().length;
          const perkAmount: number = Math.pow(10, exponent);
          clickerValue += perkAmount;
          perk.name += ` (+ ${commarize(perkAmount)} à chaque clic)`;
          break;
      }
    }
    Clicker.getInstance().value = clickerValue;
    DomHandler.clicker.updateIncrement(clickerValue);
  }

  clearActivePerks() {
    this._activePerks = [];
    //this.clearActiveJobs();
    this.applyPassivePerk();
    this.applyActivePerk();
    DomHandler.removeAllPerks();
  }
}

export default Perk;
