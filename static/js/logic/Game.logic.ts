import Clicker from "./Clicker.logic";
import Building from "./Building.logic";
import DomHandler from "./DomHandler";
import config from "./Config.logic";
import { initGuard, killGuard } from "../helper/Guard.helper";
import { log, logWithTimer } from "../helper/Console.helper";
import Perk from "./Perk.logic";
import app from "../../../package.json";
import Bonus from "./Bonus.logic";

interface ISave {
  version: string;
  buildings: IBaseBuilding[];
  currentAmount: number;
  currentDate: Date;
  startDate: Date;
  stats: IStat;
  bonus: IBaseBonus[];
}

interface IStat {
  clickCount: number;
  totalEarnings: number;
}

class Game {
  private static _instance: Game;
  version: string;
  backgroundDate: Date;
  onBackground: boolean;
  currentAmount: number;
  totalEarnings: number;
  clicker: Clicker;
  perk: Perk;
  bonus: Bonus;
  buildings: Building;
  level: number;
  private jobs: number[];

  constructor() {
    if (Game._instance) {
      return Game._instance;
    }

    Game._instance = this;
    this.version = app.version;
    this.clicker = new Clicker();
    this.currentAmount = config.game.initialAmount;
    DomHandler.init();
    this.perk = new Perk();
    this.bonus = new Bonus();
    this.buildings = new Building();
    this.jobs = [];
    this.routine();
    this.listenVisibility();
    this.level = 1;
    this.totalEarnings = 0;
    // must be called after routine();
    initGuard();
    this.loadSave();
  }

  save(): void {
    const buildingToSave: IBaseBuilding[] = this.buildings.saveBuildings();
    let save: ISave = {
      version: this.version,
      buildings: buildingToSave,
      currentAmount: this.currentAmount,
      currentDate: new Date(),
      startDate: new Date(),
      stats: {
        clickCount: this.clicker.count,
        totalEarnings: this.totalEarnings,
      },
      bonus: this.bonus.saveBonuses(),
    };
    const previousSaveString: string = localStorage.getItem("save");
    if (previousSaveString) {
      const previousSave = JSON.parse(atob(previousSaveString));
      save.startDate = previousSave.startDate || new Date();
    }

    localStorage.setItem("save", btoa(JSON.stringify(save)));
    logWithTimer(`Game has been saved !`, 1);
  }

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
      }

      if (saveObj.currentAmount) {
        this.setAmount(saveObj.currentAmount);
      }

      if (saveObj.bonus) {
        this.bonus.loadBonusFromSave(saveObj.bonus);
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
    this.totalEarnings += increment;
    return this.currentAmount;
  }

  tick(): void {
    this.buildings.tick(config.game.incomeTick);
  }

  routine(): void {
    this.jobs.push(
      setInterval(() => {
        if (!this.onBackground) {
          this.tick();
        }
      }, config.game.incomeTick)
    );

    this.jobs.push(
      setInterval(() => {
        if (!this.onBackground) {
          this.buildings.checkAvailableBuildings();
          this.bonus.checkAvailableBonus();
          log("Check assets", 3);
        }
      }, config.game.checkAssetsTick)
    );

    this.jobs.push(
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
    for (const job of this.jobs) {
      clearInterval(job);
    }
    delete Game._instance;
    Building.deleteInstance();
    Clicker.deleteInstance();
    Bonus.deleteInstance();
    Perk.deleteInstance();
    DomHandler.removeLayout();
    killGuard();
    new Game();
  }

  static getInstance(): Game {
    return Game._instance;
  }
}

export const gameInstance: () => Game = () => {
  return Game.getInstance();
};

export default Game;
