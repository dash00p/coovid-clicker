import BuildingComponent from "../component/Building.component";
import LayoutComponent from "../component/Layout.component";
import { findChildrenbyId, commarize } from "../helper/Dom.helper";
import { gameInstance } from "./Game";
import { clickerInstance } from "./Clicker.logic";
import EphemeralComponent from "../component/Ephemeral.component";
import { IBuilding } from "./Building.logic";

// this class is used to handle DOM interaction
class DomHandler {
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
    document.getElementById("clicker").onclick = DomHandler.counterClickHandler;
  }

  static renderCounter(
    value: number,
    buildingsProduction: number = undefined,
    frequency: number = undefined
  ): void {
    DomHandler.counter.textContent = commarize(value);

    if (frequency && (DomHandler.tickFrequency += frequency) % 1000 === 0) {
      if (!(typeof buildingsProduction === "undefined")) {
        DomHandler.productionCounter.textContent = commarize(
          buildingsProduction
        );
      }
      if (DomHandler.tickFrequency % 5000 === 0) {
        DomHandler.tickFrequency = 0;
        document.title = `${commarize(value)} doses | Coovid Clicker`;
      }
    }
  }

  static counterClickHandler(): void {
    const ephemeral: EphemeralComponent = new EphemeralComponent({
      icon: "random",
      event: "click"
    });
    DomHandler.renderCounter(clickerInstance().triggerClick());
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
    document.body.appendChild(
      new LayoutComponent(/*{ children: new StatComponent() }*/)
    );
  }
}

export default DomHandler;
