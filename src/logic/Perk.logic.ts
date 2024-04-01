import config from "./Config.logic";
import { perkList } from "../collection/Perk.collection";
import { log, logWithTimer } from "../helper/Console.helper";
import EphemeralComponent from "../component/EphemeralComponent";
import { commarize } from "../helper/Dom.helper";
import Core from "./core/Core.logic";
import Game from "./Game.logic";
import Building from "./Building.logic";
import Bonus from "./Bonus.logic";
import Clicker from "./Clicker.logic";
import { realSetInterval } from "../helper/Guard.helper";

class Perk extends Core<Perk> {
  state: {
    activePerks: IPerk[];
    count: number;
  };
  /** @deprecated */
  _activePerks: IPerk[];
  /** @deprecated */
  _count: number;
  _nextRoutineTimestamp: number;

  constructor() {
    super();
    this._activePerks = [];
    this._count = 0;
    this.launchRoutine();
    this.state = this.setProxy({
      activePerks: this._activePerks,
      count: this._count,
    });
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

  routine() {
    log("Perk routine");

    if (this._nextRoutineTimestamp > Date.now()) {
      if (Game.getInstance().state.onBackground) {
        setTimeout(() => {
          this.routine();
        }, 60000);
      }
      return;
    }

    if (this._nextRoutineTimestamp < Date.now()) {
      log(`Perk's ephemeral cooked !`);
      this.createEphemeral();
      this._nextRoutineTimestamp = null;
    }

    const min: number =
      config.game.perk.minTimer /
      (Bonus.getInstance()?.perkRoutineTimerReducer || 1);
    const max: number =
      config.game.perk.maxTimer /
      (Bonus.getInstance()?.perkRoutineTimerReducer || 1);
    const timer: number = Math.floor(Math.random() * (max - min)) + min;

    this._nextRoutineTimestamp = Date.now() + timer;
    log(`Next perk routine in ${timer}ms`)
    setTimeout(() => {
      this.routine();
    }, Game.getInstance().state.onBackground ? 60000 : timer);
  }

  launchRoutine(): void {
    if (!config.game.perk.active) return;

    this.routine();
  }

  createEphemeral(): void {
    new EphemeralComponent({
      icon: "wow",
      event: memeEventType.perk,
      duration: config.game.perk.duration,
      handleClick: this.selectRandomPerk,
      //killOnClick: true,
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
    this.state.activePerks.push({
      ...newPerk,
      duration,
      id,
    });
    this.applyPassivePerk();
    this.applyActivePerk();

    this.count++;

    logWithTimer(`New perk applied : ${newPerk.name}`, 1);
    setTimeout(() => {
      const index: number = this.state.activePerks.findIndex((p) => p.id === id);
      if (index < 0) return;
      this.state.activePerks.splice(index, 1);
      //this.activePerks = [...this.activePerks];
      logWithTimer(`Perk unapplied : ${newPerk.name}`, 1);
      this.applyPassivePerk();
      this.applyActivePerk();
    }, duration);
  }

  // perk that do not imply user interaction.
  applyPassivePerk(): void {
    let productionMultiplicator: number = 1;
    for (const perk of this.state.activePerks
      .filter((p) => !p.isActive && !p.isApplied)
      .sort((a, b) => a.order - b.order)) {
      switch (perk.type) {
        case perkType.productionMultiplicator:
          productionMultiplicator *= perk.value;
          break;
        case perkType.clickAuto:
          const perkValue: number =
            perk.value * Bonus.getInstance().autoClickMultiplicator;
          //refacto needed
          let intervalId: number = realSetInterval(() => {
            Clicker.getInstance().triggerClick();
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
            Game.getInstance().getAmount() * perk.value
          );
          logWithTimer(
            `Applying fortune gift (+${commarize(
              perkAmount
            )}). Old bank value: ${commarize(Game.getInstance().getAmount())}`,
            1
          );
          Game.getInstance().incrementAmount(perkAmount);
          logWithTimer(
            `New bank value: ${commarize(Game.getInstance().getAmount())}`,
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
    for (const perk of this.state.activePerks.filter((p) => p.isActive)) {
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
  }

  clearActivePerks() {
    this.state.activePerks.length = 0;
    this.clearActiveJobs();
    this.applyPassivePerk();
    this.applyActivePerk();
  }
}

export default Perk;
