import CoreComponent from "./Core.component";
import EphemeralComponent from "./Ephemeral.component";
import { clickerInstance } from "../logic/Clicker.logic";

class ClickerComponent extends CoreComponent {
  static customType: string = "game-clicker";

  constructor(props = null) {
    super(props);
    this.create("button", "Click click", ClickerComponent.customType);
    this.onclick = this.handleClick;
  }

  handleClick(): void {
    new EphemeralComponent({
      icon: "random",
      delay: 4000,
    });
    clickerInstance().triggerClick();
  }
}

customElements.define(ClickerComponent.customType, ClickerComponent);

export default ClickerComponent;
