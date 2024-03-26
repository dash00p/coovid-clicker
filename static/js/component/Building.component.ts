import commonStyle from "./common/common.component.scss";

import { commarize } from "../helper/Dom.helper";
import { upgradeList } from "../collection/BuildingUpgrade.collection";
import Building from "../logic/Building.logic";
import Bonus from "../logic/Bonus.logic";
import StyledComponent from "./common/Styled.component";

interface IState {
  level: number | null;
  rendered: boolean;
  currentAmount: number;
  currentProduction: number;
  currentMultiplicator: number;
  currentPriceDivider: number;
  name: string;
  upgrades: IBuildingUpgrade[];
}

const style: string = `
  :host {
    margin-bottom: 10px;
    display: block;
  }
  ${commonStyle}
  button {
    margin-right: 5px;
  }
  img {
    max-width: 60px;
  }
`;

export interface IBuildingComponentProps
  extends IStyledComponentProps,
  IBuilding { }

class BuildingComponent extends StyledComponent {
  declare props: IBuildingComponentProps;
  declare state: IState;

  constructor(props: IBuildingComponentProps) {
    super({ ...props, style });

    const addButton: IEnhancedHTMLElement = document.createElement("button");
    addButton.textContent = "Engager";
    addButton.className = "custom-button";
    addButton.onclick = this.handleBuyClick;
    this.wrapper = this.createChildren("li", "<div></div>", addButton);
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
      "currentPriceDivider",
      Bonus.getInstance().buildingPurchaseDivisor,
      [this.rerender]
    );
    this.listen(
      this,
      "currentMultiplicator",
      Bonus.getInstance().productionMultiplicator,
      [this.rerender]
    );
    this.listen(this, "name", this.props.name, [this.rerender]);
    this.render(this.wrapper, [this.rerender, this.renderUpgrades]);
  }

  getLevel(): number {
    return this.state.level;
  }

  setLevel(newLevel: number): void {
    this.state.level = newLevel;
  }

  rerender(): void {
    this.updateContent(
      this.find("div"),
      `${this.getImageSrc() ? `<div class="inline-block ${this.props.description ? "tooltip" : ""}" data-tooltip="${this.props.description}"><img src="${this.getImageSrc()}"  /></div>` : ""} ${this.state.name
      } (${this.state.level}${this.state.upgrades.length
        ? ` - Tier ${this.tierConverter(this.state.upgrades.length)}`
        : ``
      }) - <span class="cost">coût: ${commarize(
        this.state.currentAmount * this.state.currentPriceDivider
      )}</span> - <span class="income">production: ${commarize(
        this.state.currentProduction * this.state.currentMultiplicator, 4, true
      )} (${commarize(
        this.props.baseProduction * this.state.currentMultiplicator,
        2, true
      )} par unité)</span>&nbsp;`
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
          initialText: `${upgrade.name} (${commarize(upgrade.cost)}) x${upgrade.multiplicator
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
    const newBuilding: IBuilding = Building.getInstance().levelUpBuilding(
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
    const newBuilding: any = Building.getInstance().upgradeBuilding(upgradeId);
    if (newBuilding) {
      this.state.upgrades = [...newBuilding.activeUpgrades];
      this.state.currentProduction = newBuilding.currentProduction;
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
