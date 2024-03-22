import Game from "./Game.logic";

import BuildingComponent from "../component/Building.component";
import LayoutComponent from "../component/Layout.component";
import ClickerComponent from "../component/Clicker.component";
import BuildingListComponent from "../component/BuildingList.component";
import CounterComponent from "../component/Counter.component";
import PerksListComponent from "../component/PerkList.component";
import FooterComponent from "../component/Footer.component";
import BonusListComponent from "../component/BonusList.component";

import { findChildrenbyId, commarize } from "../helper/Dom.helper";
import Bonus from "./Bonus.logic";
import Building from "./Building.logic";

// this class is used to handle DOM interaction
class DomHandler {
  static layout: LayoutComponent;
  static clicker: ClickerComponent;
  static tickFrequency = 0;
  private static counter: Node;
  private static productionCounter: Node;
  private static buildingList: BuildingListComponent;
  private static perksList: PerksListComponent;
  private static bonusList: BonusListComponent;

  static init(): void {
    DomHandler.initLayout();
    const counter: CounterComponent = new CounterComponent();
    DomHandler.counter = counter.findById("counter");
    DomHandler.productionCounter = counter.findById("productionCounter");
    DomHandler.buildingList = new BuildingListComponent();
    DomHandler.perksList = new PerksListComponent();
    DomHandler.clicker = new ClickerComponent();
    DomHandler.bonusList = new BonusListComponent();
    DomHandler.renderCounter(Game.getInstance().currentAmount);
    DomHandler.layout.appendMain(counter);
    DomHandler.layout.appendMain(DomHandler.clicker);
    DomHandler.layout.appendMain(DomHandler.buildingList);
    DomHandler.layout.appendMain(DomHandler.perksList);
    DomHandler.layout.appendAside(DomHandler.bonusList);
    DomHandler.layout.appendMain(new FooterComponent());
  }

  static renderCounter(
    value: number,
    buildingsProduction: number = undefined,
    frequency: number = undefined
  ): void {
    DomHandler.counter.textContent = commarize(value);

    if (frequency && DomHandler.tickFrequency++ > 1000 / frequency) {
      if (!(typeof buildingsProduction === "undefined")) {
        DomHandler.productionCounter.textContent =
          commarize(buildingsProduction);
      }
      if (DomHandler.tickFrequency > 5000 / frequency) {
        DomHandler.tickFrequency = 0;
        DomHandler.updateTitle(value);
      }
    }
  }

  static updateTitle(value: number): void {
    document.title = `${commarize(value)} doses | Coovid Clicker`;
  }

  static createBuilding(newBuilding: IBuilding): void {
    DomHandler.buildingList.appendChild(
      new BuildingComponent(newBuilding),
      DomHandler.buildingList.find("ul")
    );
  }

  static updateBuildingCount(count: number): void {
    DomHandler.buildingList.state.buildingCount = count;
  }

  static removeBuilding(buildingId: number): void {
    const component: BuildingComponent = findChildrenbyId(
      DomHandler.buildingList.find("ul"),
      buildingId
    ) as BuildingComponent;
    if (component) {
      component.kill(0);
    }
  }

  static renderBuilding(building: IBuilding): void {
    const { level, currentAmount, currentProduction, activeUpgrades } =
      building;
    const component: any = findChildrenbyId(
      DomHandler.buildingList.find("ul"),
      building.id
    );

    if (component) {
      component.state.level = level;
      component.state.currentAmount = currentAmount;
      component.state.currentProduction = currentProduction;
      component.state.upgrades = activeUpgrades;
      component.state.currentMultiplicator =
        Bonus.getInstance().productionMultiplicator;
    }
  }

  static renderAllBuildings(): void {
    for (const building of Building.getInstance().currentBuildings) {
      DomHandler.renderBuilding(building);
    }
  }

  static renderPerk(newPerk: IPerk): void {
    DomHandler.perksList.addPerk(newPerk);
  }

  static removeAllPerks(): void {
    DomHandler.perksList.removeAllPerks();
  }

  static renderBonus(bonus: IBonus): void {
    DomHandler.bonusList.addBonus(bonus);
  }

  static initLayout(): void {
    DomHandler.layout = new LayoutComponent();
    document.body.appendChild(DomHandler.layout);
  }

  static removeLayout(): void {
    document.body.removeChild(DomHandler.layout);
  }
}

export default DomHandler;
