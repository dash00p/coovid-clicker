import Clicker from "./Clicker.logic.js";
import Building from "./Building.logic.js";
import DomHandler from "./DomHandler.js";
import { config } from "../collection/Config.collection.js";

class Game {
  private static _instance;
  currentAmount: number;
  clicker: Clicker;
  buildings: Building;

  constructor() {
    if (Game._instance) return Game._instance;
    Game._instance = this;
    this.clicker = new Clicker();
    this.currentAmount = config.initialAmount;
    DomHandler.init();
    this.buildings = new Building();
    this.routine();
    this.loadSave();
  }

  save() {
    const buildingToSave = this.buildings.saveBuildings();
    const save = {
      buildings: buildingToSave,
      currentAmount: this.currentAmount,
    };
    localStorage.setItem("save", btoa(JSON.stringify(save)));
    console.log("Game has been saved !");
  }

  loadSave() {
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

  getAmount() {
    return this.currentAmount;
  }

  setAmount(newAmount) {
    this.currentAmount = newAmount;
  }

  incrementAmount(increment) {
    this.currentAmount += increment;
    return this.currentAmount;
  }

  tick() {
    this.buildings.checkAvailableBuildings();
    this.buildings.tick(config.incomeTick);
  }

  routine() {
    setInterval(() => {
      this.tick();
    }, config.incomeTick);

    setInterval(() => {
      this.save();
    }, config.saveTick);
  }

  static getInstance() {
    return Game._instance;
  }
}

export const gameInstance = () => {
  return Game.getInstance();
};

export default Game;
