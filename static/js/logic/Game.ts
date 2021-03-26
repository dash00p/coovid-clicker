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
      this.tick();
    }, config.incomeTick);

    setInterval(() => {
      this.save();
    }, config.saveTick);
  }

  static getInstance(): Game {
    return Game._instance;
  }
}

export const gameInstance: () => Game = () => {
  return Game.getInstance();
};

export default Game;
