import { buidlingList } from "../collection/Buildings.collection.js";
import DomHandler from "./DomHandler.js";
import Game from "./Game.js";
import { log } from "../helper/Console.helper.js";

class Building {
  private static _instance;
  avalaibleBuildings;
  currentBuildings;
  game;

  constructor() {
    if (Building._instance) return Building._instance;
    Building._instance = this;
    this.avalaibleBuildings = buidlingList.sort(
      (a, b) => a.baseAmount - b.baseAmount
    );
    this.currentBuildings = [];
    this.game = new Game();
    this.checkAvailableBuildings();
  }

  checkAvailableBuildings() {
    log("Checking newly available buildings", 3);
    const newAvailableBuildings = this.avalaibleBuildings.filter(
      (build) => build.baseAmount <= this.game.currentAmount && !build.available
    );
    this.updateAvailableBuildings(newAvailableBuildings);
  }

  updateAvailableBuildings(newBuildings) {
    if (newBuildings.length) {
      this.avalaibleBuildings = this.avalaibleBuildings.map((b) => {
        return {
          ...b,
          available: newBuildings.find((n) => n.id === b.id)
            ? true
            : b.available,
        };
      });

      for (const newBuilding of newBuildings) {
        this.addBuilding(newBuilding);
      }
    }
  }

  addBuilding(newBuilding) {
    const buildingIndex = this.currentBuildings.findIndex(
      (b) => b.id === newBuilding.id
    );
    if (buildingIndex !== -1) return;

    const build = {
      ...newBuilding,
      level: 0,
      currentAmount: newBuilding.baseAmount,
      currentProduction: 0,
    };
    this.currentBuildings.push(build);
    DomHandler.createBuilding(build);
  }

  levelUpBuilding(id, level = 1, fromSave) {
    const buildingIndex = this.currentBuildings.findIndex((b) => b.id === id);

    if (buildingIndex === -1) {
      console.error("This building is not available yet");
      return false;
    }

    const building = this.currentBuildings[buildingIndex];
    if (!fromSave) {
      if (this.game.currentAmount < building.currentAmount) {
        console.error("This building is not affordable");
        return false;
      }

      DomHandler.renderCounter(
        this.game.incrementAmount(-building.currentAmount)
      );
    }

    building.currentAmount =
      building.currentAmount * Math.pow(building.amountMultiplier, level);
    building.level += level;
    building.currentProduction += building.baseProduction * level;
    this.currentBuildings[buildingIndex] = building;
    return building;
  }

  tick(frequency) {
    let totalBuildingsProduction = 0;
    for (const building of this.currentBuildings) {
      totalBuildingsProduction += building.currentProduction;
    }

    const realTotalProduction = totalBuildingsProduction;
    //production should be calculated every second but the tick is faster so we have to divide by the current frequency.
    totalBuildingsProduction = totalBuildingsProduction * (frequency / 1000);

    DomHandler.renderCounter(
      this.game.incrementAmount(totalBuildingsProduction),
      realTotalProduction,
      frequency
    );
  }

  saveBuildings() {
    return this.currentBuildings.map((b) => {
      return { id: b.id, level: b.level };
    });
  }

  loadBuildings(buildings) {
    const buildingsId = buildings.map((b) => b.id);
    const availableBuildingsFromSave = this.avalaibleBuildings.filter((build) =>
      buildingsId.includes(build.id)
    );
    this.updateAvailableBuildings(availableBuildingsFromSave);
    for (const upgradeBuilding of availableBuildingsFromSave) {
      const savedBuilding = buildings.find((b) => b.id === upgradeBuilding.id);
      DomHandler.renderBuilding(
        this.levelUpBuilding(upgradeBuilding.id, savedBuilding.level, true)
      );
    }
  }

  static getInstance(){
    return Building._instance;
  }
}

export const buildInstance = () => {
  return Building.getInstance();;
};

export default Building;
