import BuildingComponent from "../component/Building.component";
import LayoutComponent from "../component/Layout.component";
import { findChildrenbyId, commarize } from "../helper/Dom.helper";
import { gameInstance } from "./Game";
import { IBuilding } from "./Building.logic";
import ClickerComponent from "../component/Clicker.component";

// this class is used to handle DOM interaction
class DomHandler {
  static layout: LayoutComponent;
  static tickFrequency = 0;
  private static counter;
  private static productionCounter;
  private static buildingList;

  static init(): void {
    DomHandler.initLayout();
    DomHandler.counter = document.getElementById("counter");
    DomHandler.productionCounter = document.getElementById("productionCounter");
    DomHandler.buildingList = document.getElementById("buildingList");
    DomHandler.renderCounter(gameInstance().currentAmount);
    DomHandler.layout.appendChild(new ClickerComponent());
  }

  static renderCounter(
    value: number,
    buildingsProduction: number = undefined,
    frequency: number = undefined
  ): void {
    DomHandler.counter.textContent = commarize(value);

    if (frequency && (DomHandler.tickFrequency++ > (1000/frequency))) {
      if (!(typeof buildingsProduction === "undefined")) {
        DomHandler.productionCounter.textContent = commarize(
          buildingsProduction
        );
      }
      if (DomHandler.tickFrequency > (5000/frequency)) {
        DomHandler.tickFrequency = 0;
        DomHandler.updateTitle(value);
      }
    }
  }

  static updateTitle(value: number): void {
      document.title = `${commarize(value)} doses | Coovid Clicker`;
  }

  static createBuilding(newBuilding: IBuilding): void {
    const building: BuildingComponent = new BuildingComponent(newBuilding);
    DomHandler.buildingList.appendChild(building);
  }

  static renderBuilding(building: IBuilding): void {
    const { level, currentAmount, currentProduction } = building;
    const component: any = findChildrenbyId(
      DomHandler.buildingList,
      building.id
    );

    if (component) {
      component.state.level = level;
      component.state.currentAmount = currentAmount;
      component.state.currentProduction = currentProduction;
    }
  }

  static initLayout(): void {
    DomHandler.layout = new LayoutComponent();
    document.body.appendChild(DomHandler.layout);
  }
}

export default DomHandler;
