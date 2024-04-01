import { log } from "../helper/Console.helper";
import ElementRender from "../logic/core/Element.logic";
import Perk from "../logic/Perk.logic";
import BaseComponent from "./common/BaseComponent";
import PerkComponent from "./PerkComponent";

class PerkListComponent extends BaseComponent {
  constructor(props: object = null) {
    super({ ...props });
    this.observe(Perk.getInstance().state, 'activePerks');
  }

  render() {
    log("rendering perk list");
    return (<div>
      <h4>Perks actifs</h4>
      <ul>
        {this.state.activePerks.map((perk: IPerk) => <PerkComponent perk={perk} />)}
      </ul>
    </div>);
  }
}

customElements.define("game-perk-list", PerkListComponent);

export default PerkListComponent;
