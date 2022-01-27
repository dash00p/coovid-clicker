import BonusComponent from "./Bonus.component";
import CoreComponent from "./Core.component";

class BonusListComponent extends CoreComponent {
  static customType: string = "game-bonus-list";
  constructor(props: object = null) {
    super(props);
    this.create("h4","Mesures gouvernementales");
    this.create("ul", null);
  }

  addBonus(bonus: IBonus): void {
      this.appendChild(new BonusComponent(bonus));
  }
}

customElements.define(BonusListComponent.customType, BonusListComponent);

export default BonusListComponent;