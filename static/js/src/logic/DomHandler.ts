import BuildingComponent from "../component/Building.component.js";
import LayoutComponent from "../component/Layout.component.js";
import { findChildrenbyId, commarize } from "../helper/Dom.helper.js";
import { gameInstance } from "./Game.js";
import { clickerInstance } from "./Clicker.logic.js";
import EphemeralComponent from "../component/Ephemeral.component.js";

// This class is used to handle DOM interaction
class DomHandler {
  static tickFrequency = 0;
  private static counter;
  private static productionCounter;
  private static buildingList;

  static init() {
    DomHandler.initLayout();
    DomHandler.counter = document.getElementById("counter");
    DomHandler.productionCounter = document.getElementById("productionCounter");
    DomHandler.buildingList = document.getElementById("buildingList");
    DomHandler.renderCounter(gameInstance().currentAmount);
    document.getElementById("clicker").onclick = DomHandler.counterClickHandler;
  }

  static renderCounter(
    value,
    buildingsProduction = undefined,
    frequency = undefined
  ) {
    DomHandler.counter.textContent = commarize(value);

    if (frequency && (DomHandler.tickFrequency += frequency) % 1000 === 0) {
      if (!(buildingsProduction == undefined))
        DomHandler.productionCounter.textContent = commarize(
          buildingsProduction
        );
      if (DomHandler.tickFrequency % 5000 === 0) {
        DomHandler.tickFrequency = 0;
        document.title = `${commarize(value)} doses | Coovid Clicker`;
      }
    }
  }

  static counterClickHandler() {
    new EphemeralComponent({ icon: "random", delay: 4000 });
    DomHandler.renderCounter(clickerInstance().triggerClick());
  }

  static createBuilding(newBuilding) {
    const building = new BuildingComponent(newBuilding);
    DomHandler.buildingList.appendChild(building);
  }

  static renderBuilding(building) {
    const { level, currentAmount, currentProduction } = building;
    const component = findChildrenbyId(DomHandler.buildingList, building.id);

    if (component) {
      component.state.level = level;
      component.state.currentAmount = currentAmount;
      component.state.currentProduction = currentProduction;
    }
  }

  static initLayout() {
    document.body.appendChild(
      new LayoutComponent(/*{ children: new StatComponent() }*/)
    );
  }
}

export default DomHandler;
