import { IPerk } from "../collection/Perk.collection";
import CoreComponent from "./Core.component";
import PerkComponent from "./Perk.component";


class PerksListComponent extends CoreComponent {
    static customType: string = "game-perks-list";

    constructor(props: object = null) {
        super(props);
        this.create("h4","Active perks");
        this.create("ul", null);
    }

    addPerk(perk: IPerk): void {
        this.appendChild(new PerkComponent(perk));
    }
}

customElements.define(PerksListComponent.customType, PerksListComponent);

export default PerksListComponent;
