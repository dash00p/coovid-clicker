import BaseComponent from "./common/BaseComponent";
import ElementRender from "../logic/core/Element.logic";

import FooterComponent from "./FooterComponent";
import CounterComponent from "./CounterComponent";
import ClickerComponent from "./ClickerComponent";
import BuildingListComponent from "./BuildingListComponent";
import PerkListComponent from "./PerkListComponent";
import BonusListComponent from "./BonusListComponent";

import "../css/game.scss";
import ModalContainerComponent from "./ModalContainerComponent";

const style: string = `
  :host {display: flex;}
  #main { width: 60%;}
  #aside { width: 40%;}
`;

class LayoutComponent extends BaseComponent {
  constructor(props: ICoreComponentProps = null) {
    super({ ...props, style });
  }

  render() {
    return (
      <>
        <div id="main">
          <CounterComponent />
          <ClickerComponent />
          <BuildingListComponent />
          <FooterComponent />
          <PerkListComponent />
        </div>
        <div id="aside">
          <BonusListComponent />
        </div>
        <ModalContainerComponent />
      </>
    )
  }
}

customElements.define("game-layout", LayoutComponent);

export default LayoutComponent;