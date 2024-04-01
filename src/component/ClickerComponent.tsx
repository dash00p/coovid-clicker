import ElementRender from "../logic/core/Element.logic";
import EphemeralComponent from "./EphemeralComponent";
import { commarize } from "../helper/Dom.helper";
import Clicker from "../logic/Clicker.logic";
import BaseComponent from "./common/BaseComponent";

const style = `
  button {
    font-family: 'Quicksand', sans-serif;
  }
`

class ClickerComponent extends BaseComponent {
  incrementValue = Clicker.getInstance().state.increment;

  constructor(props: object) {
    super({ ...props, style });
    this.observe(Clicker.getInstance().state, 'increment', 'incrementValue');
  }

  handleClick(): void {
    Clicker.getInstance().triggerClick();
  }

  render() {
    return (
      <button onclick={() => this.handleClick()}>Click click (+{commarize(Math.round(this.state.incrementValue))})</button>
    )
  }
}

customElements.define("game-clicker", ClickerComponent);

export default ClickerComponent;
