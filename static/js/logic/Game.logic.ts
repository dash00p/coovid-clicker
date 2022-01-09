import Clicker from "./Clicker.logic";
import Building, { IBaseBuilding } from "./Building.logic";
import DomHandler from "./DomHandler";
import config from "../collection/Config.collection.json";
import bootstrap from "../helper/Bootstrap.helper";
import { log, logWithTimer } from "../helper/Console.helper";
import Perk from "./Perk.logic";
import app from "../../../package.json";

interface ISave {
  buildings: IBaseBuilding[];
  currentAmount: number;
  currentDate: Date;
  stats: IStat;
}

interface IStat {
  clickCount: number;
}

class Game {
  private static _instance: Game;
  version: string;
  backgroundDate: Date;
  onBackground: boolean;
  currentAmount: number;
  clicker: Clicker;
  perk: Perk;
  buildings: Building;
  level: number;

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
    this.buildings = new Building();
    this.routine();
    this.listenVisibility();
    this.level = 1;
    // must be called after routine();
    bootstrap();
    this.loadSave();
  }

  save(): void {
    const buildingToSave: IBaseBuilding[] = this.buildings.saveBuildings();
    const save: ISave = {
      buildings: buildingToSave,
      currentAmount: this.currentAmount,
      currentDate: new Date(),
      stats: {
        clickCount: this.clicker.count
      },
    };
    localStorage.setItem("save", btoa(JSON.stringify(save)));
    logWithTimer(`Game has been saved !`, 1);
  }

  loadSave(): void {
    let save: string | null = localStorage.getItem("save");
    if (save !== null) {
      const saveObj: ISave = JSON.parse(atob(save));

      if (saveObj.buildings && saveObj.buildings.length) {
        this.buildings.loadBuildings(saveObj.buildings);
      }

      if(saveObj.stats && saveObj.stats.clickCount) {
        this.clicker.count = saveObj.stats.clickCount;
      }

      if (saveObj.currentAmount) {
        this.setAmount(saveObj.currentAmount);
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
    return this.currentAmount;
  }

  tick(): void {
    this.buildings.checkAvailableBuildings();
    this.buildings.tick(config.game.incomeTick);
  }

  routine(): void {
    setInterval(() => {
      if (!this.onBackground) {
        this.tick();
      }
    }, config.game.incomeTick);

    setInterval(() => {
      if (this.onBackground) {
        this.backgroundUpgrade();
        this.backgroundDate = new Date();
      }

      this.save();
    }, config.game.saveTick);
  }

  listenVisibility(): void {
    document.addEventListener("visibilitychange", () => {
      // triggered when user switchs to another tab or desktop.
      const game:Game = Game.getInstance();
      game.onBackground = document.hidden;
      if (game.onBackground) { game.backgroundDate = new Date(); } else {
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

  static getInstance(): Game {
    return Game._instance;
  }
}

export const gameInstance: () => Game = () => {
  return Game.getInstance();
};

export default Game;
