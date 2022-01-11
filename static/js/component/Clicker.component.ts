import CoreComponent, { ICoreComponentProps } from "./Core.component";
import EphemeralComponent from "./Ephemeral.component";
import { clickerInstance } from "../logic/Clicker.logic";
import { eventType } from "../collection/Memes.collection";
import { commarize } from "../helper/Dom.helper";

class ClickerComponent extends CoreComponent {
  static customType: string = "game-clicker";

  constructor(props:ICoreComponentProps = null) {
    super(props);
    this.create("button", "Click click", ClickerComponent.customType);
    this.onclick = this.handleClick;
  }

  handleClick(): void {
    // tslint:disable-next-line: no-unused-expression
    new EphemeralComponent({
      icon: "random",
      event: eventType.click
    });
    clickerInstance().triggerClick();
  }

  updateIncrement(newIncrement: number): void {
    this.find("button").innerText = `Click click (+${commarize(Math.round(newIncrement))})`;
  }
}

customElements.define(ClickerComponent.customType, ClickerComponent);

export default ClickerComponent;
