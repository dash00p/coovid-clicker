import { buildingList, upgradeList } from "../collection/Buildings.collection";
import DomHandler from "./DomHandler";
import { gameInstance } from "./Game.logic";
import { log } from "../helper/Console.helper";
import { clickerInstance } from "./Clicker.logic";
import { bonusInstance } from "./Bonus.logic";

class Building {
  private static _instance: Building;
  avalaibleBuildings;
  currentBuildings: IBuilding[];
  currentMultiplicator: number;
  totalProduction: number;
  _buildingCount: number;
  totalProductionWithoutMultiplicator: number;

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
    this._buildingCount = 0;
    //this.checkAvailableBuildings();
  }

  get buildingCount(): number {
    return this._buildingCount;
  }

  set buildingCount(newValue: number) {
    this._buildingCount = newValue;
    DomHandler.updateBuildingCount(newValue);
  }

  checkAvailableBuildings(): void {
    log("Checking newly available buildings", 3);
    const newAvailableBuildings: IBuilding[] = this.avalaibleBuildings.filter(
      (build) =>
        ((!build.neededProduction &&
          build.baseAmount <= gameInstance().currentAmount) ||
          build.neededProduction <= this.totalProduction) &&
        !build.available
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
      activeUpgrades: [],
    };
    this.currentBuildings.push(build);
    DomHandler.createBuilding(build);
  }

  removeBuilding(buildingId: number): void {
    const jobIndex = this.currentBuildings.findIndex(
      (b) => b.id === buildingId
    );
    if (jobIndex > -1) {
      this.currentBuildings.splice(jobIndex, 1);
    }
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

    if (!fromSave) {
      clickerInstance().refreshIncrementFromBuildings(
        this.getTotalProduction()
      );
    }
    this.buildingCount += level;

    // trigger the recalculation of bonuses when the threshold of bonusType.buildingCountMultiplicator is met.
    if (
      !fromSave &&
      bonusInstance().buildingCountTrigger &&
      this.buildingCount % bonusInstance().buildingCountTrigger === 0
    ) {
      bonusInstance().applyBonus();
      DomHandler.renderAllBuildings();
    }
    return building;
  }

  upgradeBuilding(upgradeId: number, fromSave: boolean = false): any {
    const upgrade: IBuildingUpgrade = upgradeList.find(
      (u) => u.id === upgradeId
    );
    const building: IBuilding = this.currentBuildings.find(
      (b) => b.id === upgrade.buildingId
    );
    if (
      !fromSave &&
      (!upgrade || !building || upgrade.cost > gameInstance().currentAmount)
    ) {
      return false;
    }

    const { id, multiplicator, name, description, cost } = upgrade;
    building.activeUpgrades.push({
      id,
      cost,
      description,
      multiplicator,
      name,
    });
    building.baseProduction *= multiplicator;
    building.currentProduction *= multiplicator;

    if (!fromSave) {
      DomHandler.renderCounter(gameInstance().incrementAmount(-cost));
      clickerInstance().refreshIncrementFromBuildings(
        this.getTotalProduction()
      );
    }
    return building;
  }

  tick(frequency: number, isBackground?: boolean): void {
    let totalBuildingsProduction: number = this.getTotalProduction();
    const currentProduction: number =
      totalBuildingsProduction * this.currentMultiplicator;
    // production should be calculated every second but the tick is faster so we have to divide by the current frequency.
    totalBuildingsProduction = currentProduction * (frequency / 1000);

    const increment: number = gameInstance().incrementAmount(
      totalBuildingsProduction
    );

    if (!isBackground) {
      DomHandler.renderCounter(increment, currentProduction, frequency);
    }
  }

  saveBuildings(): IBaseBuilding[] {
    return this.currentBuildings.map((b) => {
      return {
        id: b.id,
        level: b.level,
        activeUpgrades: b.activeUpgrades.map((u) => {
          return { id: u.id };
        }),
      };
    });
  }

  getTotalProduction(): number {
    let totalBuildingsProduction: number = 0;
    for (const building of this.currentBuildings) {
      totalBuildingsProduction += building.currentProduction;
    }
    this.totalProductionWithoutMultiplicator = totalBuildingsProduction;
    this.totalProduction =
      totalBuildingsProduction * bonusInstance().productionMultiplicator;
    return this.totalProduction;
  }

  loadBuildings(buildings: IBaseBuilding[]): void {
    const buildingsId: number[] = buildings.map((b) => b.id);
    const availableBuildingsFromSave: IBuilding[] =
      this.avalaibleBuildings.filter((build: IBuilding) =>
        buildingsId.includes(build.id)
      );

    //Update available buildings with buildings from save + init basic buildings component
    this.updateAvailableBuildings(availableBuildingsFromSave);

    for (const leveledUpBuilding of availableBuildingsFromSave) {
      const savedBuilding: IBaseBuilding = buildings.find(
        (b) => b.id === leveledUpBuilding.id
      );
      const buildingBlueprint: IBuilding = this.avalaibleBuildings.find(
        (b) => b.id === leveledUpBuilding.id
      );
      if (
        buildingBlueprint.neededProduction &&
        this.totalProduction < buildingBlueprint.neededProduction
      ) {
        this.removeBuilding(leveledUpBuilding.id);
        return;
      }
      let newBuilding: IBuilding = this.levelUpBuilding(
        leveledUpBuilding.id,
        savedBuilding.level,
        true
      ) as IBuilding;
      if (savedBuilding.activeUpgrades) {
        for (const upgrade of savedBuilding.activeUpgrades) {
          newBuilding = this.upgradeBuilding(upgrade.id, true);
        }
      }
      this.getTotalProduction();
      DomHandler.renderBuilding(newBuilding);
    }
  }

  static getInstance(): Building {
    return Building._instance;
  }

  static deleteInstance(): void {
    delete Building._instance;
  }
}

export const buildInstance: () => Building = (): Building => {
  return Building.getInstance();
};

export default Building;
