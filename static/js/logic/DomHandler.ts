import BuildingComponent from "../component/Building.component";
import LayoutComponent from "../component/Layout.component";
import { findChildrenbyId, commarize } from "../helper/Dom.helper";
import { gameInstance } from "./Game.logic";
import { IBuilding } from "./Building.logic";
import ClickerComponent from "../component/Clicker.component";
import BuildingListComponent from "../component/BuildingList.component";
import CounterComponent from "../component/Counter.component";
import PerksListComponent from "../component/PerkList.component";
import { IPerk } from "../collection/Perk.collection";
import FooterComponent from "../component/Footer.component";

// this class is used to handle DOM interaction
class DomHandler {
  static layout: LayoutComponent;
  static clicker;
  static tickFrequency = 0;
  private static counter;
  private static productionCounter;
  private static buildingList;
  private static perksList;

  static init(): void {
    DomHandler.initLayout();
    const counter:CounterComponent = new CounterComponent();
    DomHandler.counter = counter.findById("counter");
    DomHandler.productionCounter = counter.findById("productionCounter");
    DomHandler.buildingList = new BuildingListComponent();
    DomHandler.perksList = new PerksListComponent();
    DomHandler.clicker = new ClickerComponent();
    DomHandler.renderCounter(gameInstance().currentAmount);
    DomHandler.layout.appendChild(counter);
    DomHandler.layout.appendChild(DomHandler.clicker);
    DomHandler.layout.appendChild(DomHandler.buildingList);
    DomHandler.layout.appendChild(DomHandler.perksList);
    DomHandler.layout.appendChild(new FooterComponent());
  }

  static renderCounter(
    value: number,
    buildingsProduction: number = undefined,
    frequency: number = undefined
  ): void {
    DomHandler.counter.textContent = commarize(value);

    if (frequency && (DomHandler.tickFrequency++ > (1000 / frequency))) {
      if (!(typeof buildingsProduction === "undefined")) {
        DomHandler.productionCounter.textContent = commarize(
          buildingsProduction
        );
      }
      if (DomHandler.tickFrequency > (5000 / frequency)) {
        DomHandler.tickFrequency = 0;
        DomHandler.updateTitle(value);
      }
    }
  }

  static updateTitle(value: number): void {
    document.title = `${commarize(value)} doses | Coovid Clicker`;
  }

  static createBuilding(newBuilding: IBuilding): void {
    DomHandler.buildingList.appendChild(new BuildingComponent(newBuilding));
  }

  static renderBuilding(building: IBuilding): void {
    const { level, currentAmount, currentProduction, activeUpgrades } = building;
    const component: any = findChildrenbyId(DomHandler.buildingList,
      building.id
    );

    if (component) {
      component.state.level = level;
      component.state.currentAmount = currentAmount;
      component.state.currentProduction = currentProduction;
      component.state.upgrades = activeUpgrades;
    }
  }

  static renderPerk(newPerk: IPerk): void {
    DomHandler.perksList.addPerk(newPerk);
  }

  static initLayout(): void {
    DomHandler.layout = new LayoutComponent();
    document.body.appendChild(DomHandler.layout);
  }
}

export default DomHandler;
