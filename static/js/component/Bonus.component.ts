import commonStyle from "../../css/common.component.scss";
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

        this.state.multiplicator = Math.round((props.value - 1) * 100);
        this.create("li", `${props.name} - ${this.state.multiplicator}% - ${props.isPurchased}`);

        const purchaseButton: IEnhancedHTMLElement = document.createElement("button");
        purchaseButton.textContent = "Acheter";
        purchaseButton.onclick = this.handlePurchaseClick;
        this.appendChild(purchaseButton);
    }
    this.setStyle(customstyle);

    handlePurchaseClick() {
        const newUpgrade: IBonus = bonusInstance().addBonus(this.component.props.id);

        if(newUpgrade) {
            
        } else {
                  // if falsy, building couldn't be leveled up, then 👺
      this.component.updateText(this, "Acheter 👺");
      setTimeout(() => {
        this.component.updateText(this, "Acheter");
      }, 5000);
        }
    }
}

customElements.define(BonusComponent.customType, BonusComponent);

export default BonusComponent;