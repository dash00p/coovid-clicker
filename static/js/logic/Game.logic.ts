import Core from "./core/Core.logic";
import Bonus from "./Bonus.logic";
import Building from "./Building.logic";
import Clicker from "./Clicker.logic";
import config from "./Config.logic";
import Params from "./Params.logic";
import Perk from "./Perk.logic";
import Stats from "./Stats.logic";
import app from "../../../package.json";

import DomHandler from "./DomHandler";

import { initGuard, killGuard } from "../helper/Guard.helper";
import { log, logWithTimer } from "../helper/Console.helper";

interface ISave {
  version: string;
  buildings: IBaseBuilding[];
  currentAmount: number;
  currentDate: Date;
  startDate: Date;
  stats: IStat;
  bonus: IBaseBonus[];
  params: IParams;
}

class Game extends Core<Game> {
  version: string;
  /** Datetime when user has switched the browser tab. */
  backgroundDate: Date;
  /** True if the game's browser tab is not active. */
  onBackground: boolean;
  /** Current amount available in the player's bank. */
  currentAmount: number;
  totalEarnings: number;
  clicker: Clicker;
  perk: Perk;
  bonus: Bonus;
  buildings: Building;
  params: Params;
  /** TODO: represents the amount of worlds fully completed. */
  level: number;
  stats: Stats;
  //private jobs: number[];

  constructor() {
    super();

    this.version = app.version;
    this.clicker = Clicker.getInstance();
    this.currentAmount = config.game.initialAmount;
    DomHandler.init();
    this.perk = Perk.getInstance();
    this.bonus = Bonus.getInstance();
    this.buildings = Building.getInstance();
    this.params = Params.getInstance();
    //this.jobs = [];
    this.routine();
    this.listenVisibility();
    this.level = 1;
    this.totalEarnings = 0;
    // must be called after routine();
    initGuard();
    this.loadSave();
    this.stats = Stats.getInstance();
  }

  /** Save the current game state to the local storage. */
  save(): void {
    const buildingToSave: IBaseBuilding[] = this.buildings.saveBuildings();
    let save: ISave = {
      version: this.version,
      buildings: buildingToSave,
      currentAmount: this.currentAmount,
      currentDate: new Date(),
      startDate: new Date(),
      stats: this.stats.update(),
      bonus: this.bonus.saveBonuses(),
      params: this.params.save(),
    };
    const previousSaveString: string = localStorage.getItem("save");
    if (previousSaveString) {
      const previousSave = JSON.parse(atob(previousSaveString));
      save.startDate = previousSave.startDate || new Date();
    }

    localStorage.setItem("save", btoa(JSON.stringify(save)));
    logWithTimer(`Game has been saved !`, 1);
  }

  /** Load the save from the local storage. */
  loadSave(): void {
    let save: string | null = localStorage.getItem("save");

    if (save) {
      const saveObj: ISave = JSON.parse(atob(save));

      if (saveObj.buildings && saveObj.buildings.length) {
        this.buildings.loadBuildings(saveObj.buildings);
      }

      if (saveObj.stats) {
        this.clicker.count = saveObj.stats.clickCount || 0;
        this.totalEarnings = saveObj.stats.totalEarnings || 0;
        this.perk.count = saveObj.stats.perkCount || 0;
      }

      if (saveObj.currentAmount) {
        this.setAmount(saveObj.currentAmount);
      }

      if (saveObj.bonus) {
        this.bonus.loadBonusFromSave(saveObj.bonus);
      }

      if (saveObj.params) {
        this.params.loadFromSave(saveObj.params);
      }
      log("Save loaded !", 1);
    }
  }

  getAmount(): number {
    return this.currentAmount;
  }

  setAmount(newAmount: number): void {
    this.currentAmount = newAmount;
  }

  incrementAmount(increment: number): number {
    this.currentAmount += increment;

    // only increment totalEarnings if increment is positive because method is also used to decrease the amount (ie: building purchase)
    if (increment > 0) {
      this.totalEarnings += increment;
    }

    return this.currentAmount;
  }

  /**
   * Handle ticks for buildings incomes. Triggered by the `routine` method.  */
  tick(): void {
    this.buildings.tick(config.game.incomeTick);
  }

  /**  Handles all recurrent calls like incomes, building/bonus list updates, save & background task.*/
  routine(): void {
    this._jobs.push(
      setInterval(() => {
        if (!this.onBackground) {
          this.tick();
        }
      }, config.game.incomeTick)
    );

    this._jobs.push(
      setInterval(() => {
        if (!this.onBackground) {
          this.buildings.checkAvailableBuildings();
          this.bonus.checkAvailableBonus();
          log("Check assets", 3);
        }
      }, config.game.checkAssetsTick)
    );

    this._jobs.push(
      setInterval(() => {
        if (!this.onBackground) {
          this.stats.update();
        }
      }, config.game.statsUpdateTick)
    );

    this._jobs.push(
      setInterval(() => {
        if (this.onBackground) {
          this.backgroundUpgrade();
          this.backgroundDate = new Date();
        }

        this.save();
      }, config.game.saveTick)
    );
  }

  listenVisibility(): void {
    document.addEventListener("visibilitychange", () => {
      // triggered when user switchs to another tab or desktop.
      const game: Game = Game.getInstance();
      game.onBackground = document.hidden;
      if (game.onBackground) {
        game.backgroundDate = new Date();
      } else {
        // if tab was previously hidden and now visible, a last update is needed to restore the proper income before income tick can resume.
        game.backgroundUpgrade();
      }
    });
  }

  backgroundUpgrade(): void {
    const millisecondsEllapsed: number =
      new Date().getTime() - this.backgroundDate.getTime();
    this.buildings.tick(millisecondsEllapsed, true);
    DomHandler.updateTitle(this.getAmount());
  }

  reset(): void {
    localStorage.removeItem("save");
    Game.disposeAll();
    DomHandler.removeLayout();
    killGuard();
    Game.getInstance();
  }
}

export default Game;
