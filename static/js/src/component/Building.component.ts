import CoreComponent from "./Core.component.js";
import { buildInstance } from "../logic/Building.logic.js";
import EphemeralComponent from "./Ephemeral.component.js";
import { commarize } from "../helper/Dom.helper.js";

interface IState {
  level: number | null;
  rendered: boolean;
  currentAmount: number;
  currentProduction: number;
  name: string;
}

class BuildingComponent extends CoreComponent {
  wrapper: any;
  state: IState;

  constructor(props) {
    super(props);

    const addButton = document.createElement("button");
    addButton.textContent = "Engager";
    addButton.onclick = this.handleClick;
    this.wrapper = this.createChildren("li", "<span></span>", addButton);
    this.listen(this, "level", this.props.level);
    this.listen(this, "currentAmount", this.props.currentAmount);
    this.listen(this, "currentProduction", this.props.baseProduction);
    this.listen(this, "name", this.props.name);
    this.render(this.wrapper, this.rerender());
  }

  getLevel() {
    return this.state.level;
  }

  setLevel(newLevel) {
    this.state.level = newLevel;
  }

  rerender() {
    this.updateContent(
      this.wrapper,
      `${this.getImageSrc() ? `<img src='${this.getImageSrc()}' />` : ""} ${
        this.state.name
      } (${this.state.level}) - coût ${commarize(
        this.state.currentAmount
      )} - production ${commarize(this.state.currentProduction)} (${commarize(
        this.props.baseProduction
      )} par unité)`
    );
  }

  getImageSrc() {
    return this.props.img && this.props.img.src ? this.props.img.src : null;
  }

  handleClick() {
    const newBuilding = buildInstance().levelUpBuilding(
      this.component.props.id
    );
    if (newBuilding) {
      this.component.state.currentAmount = newBuilding.currentAmount;
      this.component.state.currentProduction = newBuilding.currentProduction;
      this.component.state.level++;
    } else {
      //if falsy, couldn't level building, then 👺
      this.component.updateText(this, "Engager 👺");
      setTimeout(() => {
        this.component.updateText(this, "Engager");
      }, 5000);
    }
  }
}

customElements.define("game-building", BuildingComponent);

export default BuildingComponent;
