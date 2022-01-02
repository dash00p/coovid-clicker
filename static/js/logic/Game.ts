import Clicker from "./Clicker.logic";
import Building, { IBaseBuilding } from "./Building.logic";
import DomHandler from "./DomHandler";
import { config } from "../collection/Config.collection";
import bootstrap from "../helper/Bootstrap.helper";

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
    console.log("Game has been saved !");
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
      console.log("Save loaded !");
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
      if (!this.onBackground){
        this.tick();
      }
    }, config.incomeTick);

    setInterval(() => {
      if (!this.onBackground) this.save();
    }, config.saveTick);
  }

  listenVisibility(): void {
    document.addEventListener("visibilitychange", function () {
      const game = Game.getInstance();
      game.onBackground = document.hidden;
      if(document.hidden)
        game.backgroundDate = new Date();
      else {
        const millisecondsEllapsed =
        (new Date().getTime() - game.backgroundDate.getTime());
        game.buildings.tick(millisecondsEllapsed);
      }
    });
  }

  static getInstance(): Game {
    return Game._instance;
  }
}

export const gameInstance: () => Game = () => {
  return Game.getInstance();
};

export default Game;
