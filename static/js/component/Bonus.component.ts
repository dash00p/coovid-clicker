import { bonusInstance } from "../logic/Bonus.logic";
import CoreComponent from "./Core.component";

interface IBonusState extends ICoreComponentsState {
    multiplicator: number;
  }

export interface IBonusComponentProps extends IBonus, ICoreComponentProps {}

class BonusComponent extends CoreComponent {
    static customType: string = "game-bonus";
    state: IBonusState;

    constructor(props: IBonusComponentProps = null) {
        super(props);

        this.state.multiplicator = Math.round((props.value - 1) * 100);
        this.create("li", `${props.name} - ${this.state.multiplicator}% - ${props.isPurchased}`);

        const purchaseButton: IEnhancedHTMLElement = document.createElement("button");
        purchaseButton.textContent = "Acheter";
        purchaseButton.onclick = this.handlePurchaseClick;
        this.appendChild(purchaseButton);
    }

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