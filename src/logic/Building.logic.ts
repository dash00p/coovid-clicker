import { buildingList } from "../collection/Buildings.collection";
import { upgradeList } from "../collection/BuildingUpgrade.collection";
import { log, warn } from "../helper/Console.helper";
import Game from "./Game.logic";
import Core from "./core/Core.logic";
import Bonus from "./Bonus.logic";
import Clicker from "./Clicker.logic";

class Building extends Core<Building> {
  state: {
    currentProduction: number;
    currentBuildings: IBuilding[];
  };

  avalaibleBuildings: IAvalailableBuilding[];
  currentBuildings: IBuilding[];
  currentMultiplicator: number;
  totalProduction: number;
  _buildingCount: number;
  totalProductionWithoutMultiplicator: number;

  constructor() {
    super();

    this.avalaibleBuildings = buildingList.sort(
      (a, b) => a.baseAmount - b.baseAmount
    );
    this.currentMultiplicator = 1;
    this._buildingCount = 0;
    this.state = this.setProxy({
      currentProduction: 0,
      currentBuildings: [],
      currentMultiplicator: this.currentMultiplicator,
    });
    this.currentBuildings = this.state.currentBuildings;
  }

  /** returns the total number of buildings currently owned */
  get buildingCount(): number {
    return this._buildingCount;
  }

  set buildingCount(newValue: number) {
    this._buildingCount = newValue;
  }

  checkAvailableBuildings(): void {
    log("Checking newly available buildings", 3);
    const newAvailableBuildings: IBuilding[] = this.avalaibleBuildings.filter(
      (build) =>
        ((!build.neededProduction &&
          build.baseAmount <= Game.getInstance().getAmount()) ||
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
    this.state.currentBuildings.push(build);
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
      warn("This building is not available yet");
      return false;
    }

    const building: IBuilding = this.state.currentBuildings[buildingIndex];
    if (!fromSave) {
      // check if the player has enough money to buy the building after divider bonus has been applied to the cost.
      const actualBuildingPrice = building.currentAmount * Bonus.getInstance().state.buildingPurchaseDivisor;
      if (Game.getInstance().state.currentAmount < actualBuildingPrice) {
        warn("This building is not affordable");
        return false;
      }

      Game.getInstance().incrementAmount(-actualBuildingPrice)
    }

    building.currentAmount =
      building.currentAmount * Math.pow(building.amountMultiplier, level);
    building.level += level;
    building.currentProduction += building.baseProduction * level;
    this.state.currentBuildings[buildingIndex] = building;

    if (!fromSave) {
      Clicker.getInstance().refreshIncrementFromBuildings(
        this.getTotalProduction()
      );
    }
    this.buildingCount += level;

    // trigger the recalculation of bonuses when the threshold of bonusType.buildingCountMultiplicator is met.
    if (
      !fromSave &&
      Bonus.getInstance().buildingCountTrigger &&
      this.buildingCount % Bonus.getInstance().buildingCountTrigger === 0
    ) {
      Bonus.getInstance().applyBonus();
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

    // check if the upgrade has been already applied 
    const isUpgradeAlreadyApplied: boolean = building.activeUpgrades.findIndex(
      (u) => u.id === upgradeId
    ) !== -1;

    if (
      !fromSave &&
      (!upgrade || !building || isUpgradeAlreadyApplied || upgrade.cost > Game.getInstance().getAmount())
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
      Game.getInstance().incrementAmount(-cost);
      Clicker.getInstance().refreshIncrementFromBuildings(
        this.getTotalProduction()
      );
    }
    return building;
  }

  tick(frequency: number, isBackground?: boolean): void {
    let totalBuildingsProduction: number = this.getTotalProduction();
    // production multiplied by current perk production multiplicators
    const currentProduction: number =
      totalBuildingsProduction * this.currentMultiplicator;

    this.state.currentProduction = currentProduction;
    // production should be calculated every second but the tick is faster so we have to divide by the current frequency.
    totalBuildingsProduction = currentProduction * (frequency / 1000);

    Game.getInstance().incrementAmount(totalBuildingsProduction);
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

  /** Get total building production income, including bonus and excluding perks. */
  getTotalProduction(): number {
    let totalBuildingsProduction: number = 0;
    for (const building of this.currentBuildings) {
      totalBuildingsProduction += building.currentProduction;
    }
    this.totalProductionWithoutMultiplicator = totalBuildingsProduction;
    const bonusProdMultiplicator = Bonus.getInstance().state.productionMultiplicator;
    this.totalProduction =
      totalBuildingsProduction * bonusProdMultiplicator;
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

      // remove building from available one when when it was wrongly added to save file.
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
    }
  }
}

export default Building;
