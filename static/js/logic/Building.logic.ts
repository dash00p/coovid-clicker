import { buildingList, upgradeList } from "../collection/Buildings.collection";
import DomHandler from "./DomHandler";
import { gameInstance } from "./Game.logic";
import { log } from "../helper/Console.helper";
import { clickerInstance } from "./Clicker.logic";

export interface IBaseBuilding {
  id: number;
  level?: number;
  activeUpgrades?: IBuildingUpgrade[];
}

export interface IBuildingUpgrade {
  id: number;
  buildingId?: number;
  cost?: number;
  description?: string;
  multiplicator?: number;
  name?: string;
  requestedLevel?: number;
}

export interface IBuilding extends IBaseBuilding {
  amountMultiplier: number;
  baseAmount: number;
  baseProduction: number;
  currentAmount?: number;
  currentProduction?: number;
  description?: string;
  img?: {
    src: string;
  };
  name: string;
  neededProduction?: number;
}

class Building {
  private static _instance: Building;
  avalaibleBuildings;
  currentBuildings: IBuilding[];
  currentMultiplicator: number;
  private totalProduction: number;

  constructor() {
    if (Building._instance) {
      return Building._instance;
    }
    Building._instance = this;
    this.avalaibleBuildings = buildingList.sort(
      (a, b) => a.baseAmount - b.baseAmount
    );
    this.currentBuildings = [];
    this.currentMultiplicator = 1;
    this.checkAvailableBuildings();
  }

  checkAvailableBuildings(): void {
    log("Checking newly available buildings", 3);
    const newAvailableBuildings: IBuilding[] = this.avalaibleBuildings.filter(
      (build) =>
        ((!build.neededProduction && build.baseAmount <= gameInstance().currentAmount) ||
          build.neededProduction <= this.totalProduction)
        && !build.available
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
      activeUpgrades: []
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
      clickerInstance().refreshIncrementFromBuildings(this.getTotalProduction());
    }

    building.currentAmount =
      building.currentAmount * Math.pow(building.amountMultiplier, level);
    building.level += level;
    building.currentProduction += building.baseProduction * level;
    this.currentBuildings[buildingIndex] = building;
    return building;
  }

  upgradeBuilding(upgradeId: number, fromSave: boolean = false): any {
    const upgrade: IBuildingUpgrade = upgradeList.find(u => u.id === upgradeId);
    const building: IBuilding = this.currentBuildings.find(b => b.id === upgrade.buildingId);
    if (!fromSave && (!upgrade || !building || upgrade.cost > gameInstance().currentAmount)) { return false; }

    const { id, multiplicator, name, description, cost } = upgrade;
    building.activeUpgrades.push({
      id,
      cost,
      description,
      multiplicator,
      name
    });
    building.baseProduction *= multiplicator;
    building.currentProduction *= multiplicator;

    if (!fromSave) {
      DomHandler.renderCounter(
        gameInstance().incrementAmount(-cost)
      );
      clickerInstance().refreshIncrementFromBuildings(this.getTotalProduction());
    }
    return building;
  }

  tick(frequency: number, isBackground?: boolean): void {
    let totalBuildingsProduction: number = this.getTotalProduction();
    const currentProduction: number = totalBuildingsProduction * this.currentMultiplicator;
    // production should be calculated every second but the tick is faster so we have to divide by the current frequency.
    totalBuildingsProduction = currentProduction * (frequency / 1000);

    const increment: number = gameInstance().incrementAmount(totalBuildingsProduction);

    if (!isBackground) {
      DomHandler.renderCounter(increment, currentProduction, frequency);
    }
  }

  saveBuildings(): IBaseBuilding[] {
    return this.currentBuildings.map((b) => {
      return {
        id: b.id,
        level: b.level,
        activeUpgrades: b.activeUpgrades.map(u => {
          return { id: u.id };
        })
      };
    });
  }

  getTotalProduction(): number {
    let totalBuildingsProduction: number = 0;
    for (const building of this.currentBuildings) {
      totalBuildingsProduction += building.currentProduction;
    }
    this.totalProduction = totalBuildingsProduction;
    return totalBuildingsProduction;
  }

  loadBuildings(buildings: IBaseBuilding[]): void {
    const buildingsId: number[] = buildings.map((b) => b.id);
    const availableBuildingsFromSave: IBuilding[] =
      this.avalaibleBuildings.filter((build: IBuilding) =>
        buildingsId.includes(build.id)
      );
    this.updateAvailableBuildings(availableBuildingsFromSave);
    for (const leveledUpBuilding of availableBuildingsFromSave) {
      const savedBuilding: IBaseBuilding = buildings.find(
        (b) => b.id === leveledUpBuilding.id
      );
      let building:IBuilding = this.levelUpBuilding(
        leveledUpBuilding.id,
        savedBuilding.level,
        true
      ) as IBuilding;
      if (savedBuilding.activeUpgrades) {
        for (const upgrade of savedBuilding.activeUpgrades) {
          building = this.upgradeBuilding(upgrade.id, true);
        }
      }
      DomHandler.renderBuilding(building);
    }
    clickerInstance().refreshIncrementFromBuildings(this.getTotalProduction());
  }

  static getInstance(): Building {
    return Building._instance;
  }
}

export const buildInstance: () => Building = (): Building => {
  return Building.getInstance();
};

export default Building;
