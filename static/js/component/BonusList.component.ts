import BonusComponent from "./Bonus.component";
import style from "../../css/bonus.component.scss";
import StyledComponent from "./common/Styled.component";


class BonusListComponent extends StyledComponent {
  static customType: string = "game-bonus-list";
  constructor(props: object = null) {
    super({ ...props, style });
    this.create("h4", "Mesures gouvernementales");
    this.create("ul", null);
  }

  addBonus(bonus: IBonus): void {
    this.appendChild(new BonusComponent({ ...bonus, isPurchased: false }));
  }
}

customElements.define(BonusListComponent.customType, BonusListComponent);

export default BonusListComponent;
