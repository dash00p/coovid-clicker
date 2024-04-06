import Core from "./core/Core.logic";
import Bonus from "./Bonus.logic";
import Building from "./Building.logic";
import Clicker from "./Clicker.logic";
import config from "./Config.logic";
import Params from "./Params.logic";
import Perk from "./Perk.logic";
import Stats from "./Stats.logic";
import app from "../../package.json";

import DomHandler from "./DomHandler";

import { initGuard, killGuard } from "../helper/Guard.helper";
import { log, warn } from "../helper/Console.helper";

interface ISave {
  version: string;
  buildings: IBaseBuilding[];
  currentAmount: number;
  currentDate: Date;
  /** Date when the player game has been started. */
  startDate: Date;
  stats: IStat;
  bonus: IBaseBonus[];
  params: IParams;
}

class Game extends Core<Game> {
  version: string;
  /** Datetime when user has switched the browser tab. */
  backgroundDate: Date;
  totalEarnings: number;
  clicker: Clicker;
  perk: Perk;
  bonus: Bonus;
  buildings: Building;
  params: Params;
  /** TODO: represents the amount of worlds fully completed. */
  level: number;
  stats: Stats;

  state: {
    /** Current amount available in the player's bank. */
    currentAmount: number;
    totalEarnings: number;
    /** True if the game's browser tab is not active. */
    onBackground: boolean;
  }

  constructor() {
    super();

    this.version = app.version;
    this.clicker = Clicker.getInstance();
    this.state = this.setProxy({
      currentAmount:
        config.game.initialAmount,
      totalEarnings: 0,
      onBackground: false
    });
    this.perk = Perk.getInstance();
    this.bonus = Bonus.getInstance();
    this.buildings = Building.getInstance();
    this.params = Params.getInstance();
    this.routine();
    this.listenVisibility();
    this.level = 1;
    // // must be called after routine();
    initGuard();
    this.stats = Stats.getInstance();
    this.loadSave();
    this.updateBrowserTitle();
  }

  /** Save the current game state to the local storage. */
  save(): void {
    const previousSaveString: string = localStorage.getItem("save");

    let previousSave: ISave;
    if (previousSaveString)
      previousSave = JSON.parse(atob(previousSaveString));

    const save: ISave = {
      version: this.version,
      buildings: this.buildings.saveBuildings(),
      currentAmount: this.getAmount(),
      currentDate: new Date(),
      // keep the startDate of the existing save
      startDate: previousSave?.startDate || new Date(),
      stats: this.stats.update(),
      bonus: this.bonus.saveBonuses(),
      params: this.params.save(),
    };

    localStorage.setItem("save", btoa(JSON.stringify(save)));
    log(`Game has been saved !`);
  }

  importSave(saveString: string): boolean {
    try {
      const checkSave: ISave = JSON.parse(atob(saveString));
      if (!checkSave.version) {
        warn("Invalid save format");
        return false;
      }
      localStorage.setItem("save", saveString);
      this.reset(true);
      return true;
    } catch (e) {
      warn("Invalid save format");
      return false;
    }

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
        this.state.totalEarnings = saveObj.stats.totalEarnings || 0;
        //this.perk.count = saveObj.stats.perkCount || 0;
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
    return this.state.currentAmount;
  }

  setAmount(newAmount: number): void {
    this.state.currentAmount = newAmount;
  }

  incrementAmount(increment: number): number {
    this.state.currentAmount += increment;

    // only increment totalEarnings if increment is positive because method is also used to decrease the amount (ie: building purchase)
    if (increment > 0) {
      this.state.totalEarnings += increment;
    }

    return this.state.currentAmount;
  }

  /**
   * Handle ticks for buildings incomes. Triggered by the `routine` method.  */
  buildingTick(): void {
    this.buildings.tick(config.game.incomeTick);
  }

  updateBrowserTitle(): void {
    DomHandler.updateTitle(this.getAmount());
  }

  /**  Handles all recurrent calls like incomes, building/bonus list updates, save & background task.
   * Refacto needed to use only 1 setInterval and avoid browser background task pause.
  */
  routine(): void {
    this._jobs.push(
      setInterval(() => {
        if (!this.state.onBackground) {
          this.buildingTick();
        }
      }, config.game.incomeTick)
    );

    this._jobs.push(
      setInterval(() => {
        if (!this.state.onBackground) {
          this.buildings.checkAvailableBuildings();
          this.bonus.checkAvailableBonus();
          log("Check assets");
        }
      }, config.game.checkAssetsTick)
    );

    this._jobs.push(
      setInterval(() => {
        if (!this.state.onBackground) {
          this.stats.update();
          this.updateBrowserTitle();
        }
      }, config.game.statsUpdateTick)
    );

    this._jobs.push(
      setInterval(() => {
        if (this.state.onBackground) {
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
      game.state.onBackground = document.hidden;
      if (game.state.onBackground) {
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
    this.updateBrowserTitle();
  }

  reset(isGameImport: boolean = false): void {
    if (!isGameImport)
      localStorage.removeItem("save");
    Game.disposeAll();
    killGuard();
    document.body.removeChild(document.getElementsByTagName('game-container')[0])
    Game.getInstance();
    document.body.appendChild(document.createElement('game-container'))
  }
}

export default Game;
