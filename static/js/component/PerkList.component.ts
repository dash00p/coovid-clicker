import CoreComponent from "./common/Core.component";
import PerkComponent from "./Perk.component";

class PerksListComponent extends CoreComponent {
  static customType: string = "game-perks-list";

  constructor(props: object = null) {
    super(props);
    this.create("h4", "Perks actifs");
    this.create("ul", null);
  }

  addPerk(perk: IPerk): void {
    const newPerk = new PerkComponent(perk);
    this.appendChild(newPerk, this.find("ul"));
  }

  removeAllPerks(): void {
    this.removeAllChild(this.find("ul"));
  }
}

customElements.define(PerksListComponent.customType, PerksListComponent);

export default PerksListComponent;
