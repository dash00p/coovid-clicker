import Clicker from "./Clicker.logic";
import Building, { IBaseBuilding } from "./Building.logic";
import DomHandler from "./DomHandler";
import { config } from "../collection/Config.collection";
import bootstrap from "../helper/Bootstrap.helper";
import { log, logWithTimer } from "../helper/Console.helper";

interface ISave {
  buildings: IBaseBuilding[];
  currentAmount: number;
}

class Game {
  private static _instance: Game;
  backgroundDate: Date;
  onBackground: boolean;
  currentAmount: number;
  clicker: Clicker;
  buildings: Building;

  constructor() {
    if (Game._instance) {
      return Game._instance;
    }
    Game._instance = this;
    this.clicker = new Clicker();
    this.currentAmount = config.initialAmount;
    DomHandler.init();
    this.buildings = new Building();
    this.routine();
    this.listenVisibility();
    // must be called after routine();
    bootstrap();
    this.loadSave();
  }

  save(): void {
    const buildingToSave: IBaseBuilding[] = this.buildings.saveBuildings();
    const save: ISave = {
      buildings: buildingToSave,
      currentAmount: this.currentAmount,
    };
    localStorage.setItem("save", btoa(JSON.stringify(save)));
    logWithTimer(`Game has been saved !`, 1);
  }

  loadSave(): void {
    let save: string | null = localStorage.getItem("save");
    if (save !== null) {
      const saveObj: any = JSON.parse(atob(save));

      if (saveObj.buildings && saveObj.buildings.length) {
        this.buildings.loadBuildings(saveObj.buildings);
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
    this.buildings.tick(config.incomeTick);
  }

  routine(): void {
    setInterval(() => {
      if (!this.onBackground) {
        this.tick();
      }
    }, config.incomeTick);

    setInterval(() => {
      if (this.onBackground) {
        this.backgroundUpgrade();
        this.backgroundDate = new Date();
      }

      this.save();
    }, config.saveTick);
  }

  listenVisibility(): void {
    document.addEventListener("visibilitychange", function () {
      // triggered when user switchs to another tab or desktop.
      const game = Game.getInstance();
      game.onBackground = document.hidden;
      if (game.onBackground) game.backgroundDate = new Date();
      else {
        game.backgroundUpgrade();
      }
    });
  }

  backgroundUpgrade(): void {
    const millisecondsEllapsed =
      new Date().getTime() - this.backgroundDate.getTime();
    this.buildings.tick(millisecondsEllapsed, true);
  }

  static getInstance(): Game {
    return Game._instance;
  }
}

export const gameInstance: () => Game = () => {
  return Game.getInstance();
};

export default Game;
