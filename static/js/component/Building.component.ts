import commonStyle from "../../css/common.component.scss";

import CoreComponent from "./Core.component";
import { buildInstance } from "../logic/Building.logic";
import { commarize } from "../helper/Dom.helper";
import { upgradeList } from "../collection/Buildings.collection";
import { bonusInstance } from "../logic/Bonus.logic";

interface IState {
  level: number | null;
  rendered: boolean;
  currentAmount: number;
  currentProduction: number;
  currentMultiplicator: number;
  name: string;
  upgrades: IBuildingUpgrade[];
}

const styleContent: string = `
  :host {
    margin-bottom: 5px;
    display: block;
  }
  ${commonStyle}
  button {
    margin-right: 5px;
  }
`;

export interface IBuildingComponentProps
  extends ICoreComponentProps,
    IBuilding {}

class BuildingComponent extends CoreComponent {
  declare props: IBuildingComponentProps;
  declare state: IState;

  constructor(props: IBuildingComponentProps) {
    super(props);

    const addButton: IEnhancedHTMLElement = document.createElement("button");
    addButton.textContent = "Engager";
    addButton.onclick = this.handleBuyClick;
    this.wrapper = this.createChildren("li", "<span></span>", addButton);
    this.wrapper.appendChild(this.createChildren("ul", "<li></li>"));
    this.listen(this, "level", this.props.level, [
      this.rerender,
      this.renderUpgrades,
    ]);
    this.listen(this, "upgrades", this.props.activeUpgrades, [
      this.renderUpgrades,
    ]);
    this.listen(this, "currentAmount", this.props.currentAmount, [
      this.rerender,
    ]);
    this.listen(this, "currentProduction", this.props.currentProduction, [
      this.rerender,
    ]);
    this.listen(
      this,
      "currentMultiplicator",
      bonusInstance().productionMultiplicator,
      [this.rerender]
    );
    this.listen(this, "name", this.props.name, [this.rerender]);
    this.render(this.wrapper, [this.rerender, this.renderUpgrades]);
    this.setStyle(styleContent);
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
      } (${this.state.level}${
        this.state.upgrades.length
          ? ` - Tier ${this.tierConverter(this.state.upgrades.length)}`
          : ``
      }) - coût <span class="cost">${commarize(
        this.state.currentAmount
      )}</span> - production <span class="income">${commarize(
        this.state.currentProduction * this.state.currentMultiplicator
      )}</span> (${commarize(
        this.props.baseProduction * this.state.currentMultiplicator
      )} par unité)&nbsp;`
    );
  }

  renderUpgrades(): void {
    const activeUpgrades = this.state.upgrades.map((u) => u.id);
    const availableUpgrades: IBuildingUpgrade[] = upgradeList.filter(
      (u) =>
        u.buildingId === this.props.id &&
        u.requestedLevel <= this.state.level &&
        !activeUpgrades.includes(u.id)
    );
    if (availableUpgrades.length) {
      this.setHTML("Améliorations: ", this.find("ul li"));
      for (const upgrade of availableUpgrades) {
        const upgradeButton: IEnhancedHTMLElement =
          document.createElement("button");
        upgradeButton.props = {
          initialText: `${upgrade.name} (${commarize(upgrade.cost)}) x${
            upgrade.multiplicator
          }`,
        };
        upgradeButton.textContent = `${upgradeButton.props.initialText}`;
        upgradeButton.onclick = (ev) => {
          this.handleUpgradeClick(upgrade.id, ev);
        };
        this.appendChild(upgradeButton, this.find("ul li"));
      }
      this.find("ul").style.display = "";
    } else {
      this.find("ul").style.display = "none";
    }
  }

  getImageSrc(): string | null {
    return this.props.img && this.props.img.src ? this.props.img.src : null;
  }

  handleBuyClick(): void {
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
  handleUpgradeClick(upgradeId: number, event: MouseEvent): void {
    const newBuilding: any = buildInstance().upgradeBuilding(upgradeId);
    if (newBuilding) {
      this.state.currentProduction = newBuilding.currentProduction;
      this.state.upgrades = [...newBuilding.activeUpgrades];
    } else {
      const target: IEnhancedHTMLElement = event.target as HTMLElement;
      const text: string = target.props.initialText;
      //   if falsy, building couldn't be leveled up, then 👺
      target.innerText = text + " 👺";
      setTimeout(() => {
        target.innerText = text;
      }, 5000);
    }
  }

  tierConverter(tier: number) {
    switch (tier) {
      case 1:
        return "I";
      case 2:
        return "II";
      case 3:
        return "III";
      case 4:
        return "IV";
      case 5:
        return "V";
    }
  }
}

customElements.define("game-building", BuildingComponent as any);

export default BuildingComponent;
