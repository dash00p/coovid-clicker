import commonStyle from "./common/common.component.scss";

import Building from "../logic/Building.logic";
import ElementRender from "../logic/core/Element.logic";
import BaseComponent from "./common/BaseComponent";
import { commarize } from "../helper/Dom.helper";
import { upgradeList } from "../collection/BuildingUpgrade.collection";
import { log } from "../helper/Console.helper";

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

interface IBuildingComponentV2Props extends IBaseComponentProps {
  building: IBuilding,
  productionMultiplicator: number,
  currentPriceDivider: number
}

class BuildingComponentV2 extends BaseComponent<IBuildingComponentV2Props> {
  constructor(props: IBuildingComponentV2Props = null) {
    super({ ...props, style });
    this.observe(props.building, 'activeUpgrades');
  }

  handleBuy(event: MouseEvent) {
    const building = this.props.building;

    const newBuilding = Building.getInstance().levelUpBuilding(
      building.id
    ) as IBuilding;
    if (!newBuilding) {
      const button = event.currentTarget as HTMLButtonElement;
      // if falsy, building couldn't be leveled up, then 👺
      button.textContent = "Engager 👺";
      setTimeout(() => {
        button.textContent = "Engager";
      }, 5000);
    }
  }

  handleUpgradeClick(upgradeId: number, event: MouseEvent) {
    const newBuilding = Building.getInstance().upgradeBuilding(upgradeId) as IBuilding;
    if (!newBuilding) {
      const button = event.currentTarget as HTMLButtonElement;
      const text: string = button.textContent;
      // if falsy, building couldn't be leveled up, then 👺
      button.innerText = text + " 👺";
      setTimeout(() => {
        button.innerText = text;
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

  render() {
    const building = this.props.building;
    const upgrades = upgradeList.filter((upgrade) =>
      upgrade.buildingId === building.id &&
      !building.activeUpgrades.find((activeUpgrade) => activeUpgrade.id === upgrade.id) &&
      upgrade.requestedLevel <= building.level
    );
    const currentProductionWithMulti = building.currentProduction * this.props.productionMultiplicator;
    log(`rendering building: ${building.name}`);
    const unitProduction = building.baseProduction * this.props.productionMultiplicator;
    const currentPrice = building.currentAmount * this.props.currentPriceDivider
    return (
      <li>
        <div>
          <div className={(building.description ? "tooltip" : "") + " inline-block"} dataset={{ tooltip: building.description }}>
            {building.img ? <img src={building.img.src} alt={building.name} /> : <></>}
          </div>
          {` `}
          {building.name?.length > 0 && <h4 className="inline-block">{building.name}</h4>}
          <span>
            {` `}(Niveau: {building.level} {building.activeUpgrades.length > 0 && `- Tier ${this.tierConverter(building.activeUpgrades.length)}`})
          </span>
          <br />
          <span className="cost">
            Coût: {commarize(currentPrice)} vaccins
          </span>
          {` - `}
          <span className="income">
            <span className={(building.currentProduction !== currentProductionWithMulti ? "tooltip" : "")} dataset={{ tooltip: `Production sans mesures gouvernementales : ${building.currentProduction} doses/s` }}>Production: {commarize(currentProductionWithMulti, 4, true)} dose{currentProductionWithMulti >= 2 && 's'}/s
              {` `}Par unité: {commarize(unitProduction, 0, true)} dose{unitProduction >= 2 && 's'}/s
            </span>
          </span>
        </div>
        <button className="custom-button" onclick={(target: MouseEvent) => this.handleBuy(target)}>Engager</button>
        {upgrades.length > 0 && <ul><li>
          {upgrades.map((upgrade) => {
            return (
              <button onclick={(event: MouseEvent) => this.handleUpgradeClick(upgrade.id, event)}>
                {upgrade.name} ({commarize(upgrade.cost)}) x{upgrade.multiplicator}
              </button>
            );
          }
          )}
        </li>
        </ul>}
      </li>);
  }
}

customElements.define("game-building", BuildingComponentV2);

export default BuildingComponentV2;
