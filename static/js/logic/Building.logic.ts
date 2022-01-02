import { buidlingList } from "../collection/Buildings.collection";
import DomHandler from "./DomHandler";
import { gameInstance } from "./Game";
import { log } from "../helper/Console.helper";

export interface IBaseBuilding {
  id: number;
  level?: number;
}

export interface IBuilding extends IBaseBuilding {
  amountMultiplier: number;
  baseAmount: number;
  baseProduction: number;
  currentAmount?: number;
  currentProduction?: number;
  description?: string;
  name: string;
  img?: {
    src: string;
  };
}

class Building {
  private static _instance: Building;
  avalaibleBuildings;
  currentBuildings: IBuilding[];

  constructor() {
    if (Building._instance) {
      return Building._instance;
    }
    Building._instance = this;
    this.avalaibleBuildings = buidlingList.sort(
      (a, b) => a.baseAmount - b.baseAmount
    );
    this.currentBuildings = [];
    this.checkAvailableBuildings();
  }

  checkAvailableBuildings(): void {
    log("Checking newly available buildings", 3);
    const newAvailableBuildings: IBuilding[] = this.avalaibleBuildings.filter(
      (build) =>
        build.baseAmount <= gameInstance().currentAmount && !build.available
    );
    this.updateAvailableBuildings(newAvailableBuildings);
  }

  updateAvailableBuildings(newBuildings: IBuilding[]): void {
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

  addBuilding(newBuilding: IBuilding): void {
    const buildingIndex: number = this.currentBuildings.findIndex(
      (b) => b.id === newBuilding.id
    );
    if (buildingIndex !== -1) {
      return;
    }

    const build: IBuilding = {
      ...newBuilding,
      level: 0,
      currentAmount: newBuilding.baseAmount,
      currentProduction: 0,
    };
    this.currentBuildings.push(build);
    DomHandler.createBuilding(build);
  }

  levelUpBuilding(
    id: number,
    level: number = 1,
    fromSave: boolean = false
  ): IBuilding | boolean {
    const buildingIndex: number = this.currentBuildings.findIndex(
      (b) => b.id === id
    );

    if (buildingIndex === -1) {
      console.error("This building is not available yet");
      return false;
    }

    const building: IBuilding = this.currentBuildings[buildingIndex];
    if (!fromSave) {
      if (gameInstance().currentAmount < building.currentAmount) {
        console.error("This building is not affordable");
        return false;
      }

      DomHandler.renderCounter(
        gameInstance().incrementAmount(-building.currentAmount)
      );
    }

    building.currentAmount =
      building.currentAmount * Math.pow(building.amountMultiplier, level);
    building.level += level;
    building.currentProduction += building.baseProduction * level;
    this.currentBuildings[buildingIndex] = building;
    return building;
  }

  tick(frequency: number, isBackground?: boolean): void {
    let totalBuildingsProduction: number = 0;
    for (const building of this.currentBuildings) {
      totalBuildingsProduction += building.currentProduction;
    }

    const realTotalProduction: number = totalBuildingsProduction;
    // production should be calculated every second but the tick is faster so we have to divide by the current frequency.
    totalBuildingsProduction = totalBuildingsProduction * (frequency / 1000);

    const increment = gameInstance().incrementAmount(totalBuildingsProduction);

    if (!isBackground) {
      DomHandler.renderCounter(increment, realTotalProduction, frequency);
    }
  }

  saveBuildings(): IBaseBuilding[] {
    return this.currentBuildings.map((b) => {
      return { id: b.id, level: b.level };
    });
  }

  loadBuildings(buildings: IBaseBuilding[]): void {
    const buildingsId: number[] = buildings.map((b) => b.id);
    const availableBuildingsFromSave: IBuilding[] =
      this.avalaibleBuildings.filter((build: IBuilding) =>
        buildingsId.includes(build.id)
      );
    this.updateAvailableBuildings(availableBuildingsFromSave);
    for (const upgradeBuilding of availableBuildingsFromSave) {
      const savedBuilding: IBaseBuilding = buildings.find(
        (b) => b.id === upgradeBuilding.id
      );
      DomHandler.renderBuilding(
        this.levelUpBuilding(
          upgradeBuilding.id,
          savedBuilding.level,
          true
        ) as IBuilding
      );
    }
  }

  static getInstance(): Building {
    return Building._instance;
  }
}

export const buildInstance: () => Building = (): Building => {
  return Building.getInstance();
};

export default Building;
