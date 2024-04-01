import { commarize } from "../helper/Dom.helper";
import Bonus from "../logic/Bonus.logic";
import Building from "../logic/Building.logic";
import Game from "../logic/Game.logic";
import ElementRender from "../logic/core/Element.logic";
import BaseComponent from "./common/BaseComponent";

class CounterComponent extends BaseComponent {
  declare state: {
    counterValue: number,
    productionCounter: number,
    productionMultiplicator: number
  };

  constructor(props: object) {
    super({ ...props });
    this.observe(Game.getInstance().state, 'currentAmount', 'counterValue');
    this.observe(Building.getInstance().state, 'currentProduction', 'productionCounter');
  }

  render() {
    return (
      <>
        {commarize(this.state.counterValue)} de vaccins ({commarize(this.state.productionCounter)} doses produites par seconde)
        <br />
      </>
    );
  }
}

customElements.define("game-counter", CounterComponent);

export default CounterComponent;
