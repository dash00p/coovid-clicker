import commonStyle from "../../css/common.component.scss";

import { commarize } from "../helper/Dom.helper";
import { bonusInstance } from "../logic/Bonus.logic";
import CoreComponent from "./Core.component";

export interface IBonusComponentProps extends IBonus, ICoreComponentProps {}

const customstyle: string = `${commonStyle}
  button { margin-left:5px; }`;

class BonusComponent extends CoreComponent {
  static customType: string = "game-bonus";
  description: string;
  declare props: IBonusComponentProps;

  constructor(props: IBonusComponentProps = null) {
    super(props);

    this.setDescription();
    this.create(
      "li",
      `${props.name} - ${this.description} - <span class="cost">${commarize(
        props.cost
      )}</span>`
    );

    const purchaseButton: IEnhancedHTMLElement =
      document.createElement("button");
    purchaseButton.textContent = "Acheter";
    purchaseButton.onclick = this.handlePurchaseClick;
    purchaseButton.className = commonStyle.cost;
    this.appendChild(purchaseButton, this.find("li"), true);

    this.setStyle(customstyle);
  }

  handlePurchaseClick() {
    const newUpgrade: IBonus = bonusInstance().addBonus(
      this.component.props.id
    );

    if (newUpgrade) {
      this.component.kill();
    } else {
      // if falsy, building couldn't be leveled up, then 👺
      this.component.updateText(this, "Acheter 👺");
      setTimeout(() => {
        this.component.updateText(this, "Acheter");
      }, 5000);
    }
  }

  setDescription() {
    switch (this.props.type) {
      case bonusType.productionMultiplicator:
        const multiplicator = Math.round((this.props.value - 1) * 100);
        this.description = `augmente la production de ${multiplicator}%`;
        break;
      case bonusType.perkTimerReducer:
        this.description = `réduit le temps d'apparition des perks par ${this.props.value}`;
        break;
    }
  }
}

customElements.define(BonusComponent.customType, BonusComponent);

export default BonusComponent;
