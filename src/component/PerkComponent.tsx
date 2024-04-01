import ElementRender from "../logic/core/Element.logic";
import BaseComponent from "./common/BaseComponent";


interface IPerkState extends ICoreComponentsState {
  expirationTimestamp: number;
}

interface IPerkComponentProps extends IBaseComponentProps {
  perk: IPerk;
}

class PerkComponent extends BaseComponent<IPerkComponentProps> {
  declare state: IPerkState;

  constructor(props: IPerkComponentProps = null) {
    super(props);
    this.state.expirationTimestamp = Date.now() + props.perk.duration;
    this.updateTimer();
    this.kill(props.perk.duration);
  }

  updateTimer() {
    this.setInterval(() => this.rerender(), 950);
  }

  render() {
    return (<li>
      {this.props.perk.name} {Math.floor((this.state.expirationTimestamp - Date.now()) / 1000)}s
    </li>);
  }
}

customElements.define("game-perk", PerkComponent);

export default PerkComponent;
