import commonStyle from "./common/common.component.scss";

import { commarize } from "../helper/Dom.helper";
import Bonus from "../logic/Bonus.logic";
import ElementRender from "../logic/core/Element.logic";
import BaseComponent from "./common/BaseComponent";

const style: string = `${commonStyle}
:host {
  margin-bottom: 5px;
  display: block;
}
  button { margin-left:5px; }`;

class BonusComponent extends BaseComponent<IBonusComponentProps> {
  static customType: string = "game-bonus";
  description: string;

  constructor(props: IBonusComponentProps = null) {
    super({ ...props, style });

    this.setDescription();
  }

  handlePurchaseClick(event: MouseEvent) {
    const newUpgrade: IBonus = Bonus.getInstance().addBonus(
      this.props.id
    );

    if (newUpgrade) {
      this.kill();
    } else {
      const button = event.currentTarget as HTMLButtonElement;
      // if falsy, building couldn't be leveled up, then 👺
      button.textContent = "Acheter 👺";
      setTimeout(() => {
        button.textContent = "Acheter";
      }, 5000);
    }
  }

  setDescription() {
    const value = Math.round(
      (this.props.value - (this.props.value > 1 ? 1 : 0)) * 100
    );
    switch (this.props.type) {
      case bonusType.productionMultiplicator:
        this.description = `augmente la production de ${value}%`;
        break;
      case bonusType.perkTimerReducer:
        this.description = `réduit le temps d'apparition des perks de ${value / 2
          }%`;
        break;
      case bonusType.perkEffectMultiplicator:
        this.description = `augmente la durée des perks de ${value}%`;
        break;
      case bonusType.autoClickMultiplicator:
        this.description = `augmente l'efficacité de l'autoclick de ${value}%`;
        break;
      case bonusType.buildingCountMultiplicator:
        this.description = `augmente de ${value}% la production pour chaque lot de ${this.props.value2} unités.`;
        break;
      case bonusType.perkClickMultiplicator:
        this.description = `multiplie la valeur du "Super click" par ${this.props.value}`;
        break
      case bonusType.buildingPurchaseDivisor:
        this.description = `Réduit de ${100 - value}% le coût d'une nouvelle unité.`;
        break;
    }
  }

  render() {
    const content = (
      <li>
        {this.props.name} - {this.description} - <span className="cost">{commarize(this.props.cost)}</span> <button onclick={(target: MouseEvent) => this.handlePurchaseClick(target)}>Acheter</button>
      </li>
    );

    return content;
  }
}

customElements.define(BonusComponent.customType, BonusComponent);

export default BonusComponent;
