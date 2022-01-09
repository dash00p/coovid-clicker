import CoreComponent, { ICoreComponentProps } from "./Core.component";
import { buildInstance, IBuilding } from "../logic/Building.logic";
import { commarize } from "../helper/Dom.helper";
import { IEnhancedHTMLElement } from "../type/html";

interface IState {
  level: number | null;
  rendered: boolean;
  currentAmount: number;
  currentProduction: number;
  name: string;
}

export interface IBuildingComponentProps extends ICoreComponentProps, IBuilding {}

class BuildingComponent extends CoreComponent {
  props: IBuildingComponentProps;
  wrapper: any;
  state: IState;

  constructor(props: IBuildingComponentProps) {
    super(props);

    const addButton: IEnhancedHTMLElement = document.createElement("button");
    addButton.textContent = "Engager";
    addButton.onclick = this.handleClick;
    this.wrapper = this.createChildren("li", "<span></span>", addButton);
    this.listen(this, "level", this.props.level, this.rerender);
    this.listen(this, "currentAmount", this.props.currentAmount, this.rerender);
    this.listen(this, "currentProduction", this.props.baseProduction, this.rerender);
    this.listen(this, "name", this.props.name, this.rerender);
    this.render(this.wrapper, this.rerender);
  }

  getLevel(): number {
    return this.state.level;
  }

  setLevel(newLevel: number): void {
    this.state.level = newLevel;
  }

  rerender(): void {
    this.updateContent(
      this.find("span"),
      `${this.getImageSrc() ? `<img src='${this.getImageSrc()}' />` : ""} ${
        this.state.name
      } (${this.state.level}) - coût ${commarize(
        this.state.currentAmount
      )} - production ${commarize(this.state.currentProduction)} (${commarize(
        this.props.baseProduction
      )} par unité)&nbsp;`
    );
  }

  getImageSrc(): string | null {
    return this.props.img && this.props.img.src ? this.props.img.src : null;
  }

  handleClick(): void {
    const newBuilding: IBuilding = buildInstance().levelUpBuilding(
      this.component.props.id
    ) as IBuilding;
    if (newBuilding) {
      this.component.state.currentAmount = newBuilding.currentAmount;
      this.component.state.currentProduction = newBuilding.currentProduction;
      this.component.state.level++;
    } else {
      // if falsy, building couldn't be leveled up, then 👺
      this.component.updateText(this, "Engager 👺");
      setTimeout(() => {
        this.component.updateText(this, "Engager");
      }, 5000);
    }
  }
}

customElements.define("game-building", BuildingComponent as any);

export default BuildingComponent;
