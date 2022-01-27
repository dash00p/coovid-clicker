import CoreComponent from "./Core.component";
import EphemeralComponent from "./Ephemeral.component";
import { clickerInstance } from "../logic/Clicker.logic";
import { commarize } from "../helper/Dom.helper";

const styleContent = `
  button {
    font-family: 'Quicksand', sans-serif;
  }
`

class ClickerComponent extends CoreComponent {
  static customType: string = "game-clicker";

  constructor(props:ICoreComponentProps = null) {
    super(props);
    this.create("button", "Click click", ClickerComponent.customType);
    this.onclick = this.handleClick;
    this.setStyle(styleContent);
  }

  handleClick(): void {
    // tslint:disable-next-line: no-unused-expression
    new EphemeralComponent({
      icon: "random",
      event: memeEventType.click
    });
    clickerInstance().triggerClick();
  }

  updateIncrement(newIncrement: number): void {
    this.find("button").innerText = `Click click (+${commarize(Math.round(newIncrement))})`;
  }
}

customElements.define(ClickerComponent.customType, ClickerComponent);

export default ClickerComponent;
