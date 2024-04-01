import DevToolsComponent from "./DevToolsComponent";
import ModalStatsComponent from "./modal/ModalStatsComponent";
import ModalParamsComponent from "./modal/ModalParamsComponent";
import Game from "../logic/Game.logic";
import ElementRender from "../logic/core/Element.logic";
import BaseComponent from "./common/BaseComponent";
import Modal from "../logic/Modal.logic";

const style: string = `
    footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }

    span {
      float: right;
    }

    h3 {
      margin:0;
      display: inline-block;
    }

    button {
      margin-left: 5px;
    }
`;

class FooterComponent extends BaseComponent {
  constructor(props: object = null) {
    super({ ...props, style });
  }

  openStatsModal() {
    Modal.getInstance().addModal(new ModalStatsComponent());
  }

  openParamsModal() {
    Modal.getInstance().addModal(new ModalParamsComponent());
  }

  render() {
    return (
      <footer>
        <span>version: {Game.getInstance().version}</span>
        <div>
          <h3>Menu</h3>
          <button onclick={() => this.openParamsModal()}>Paramètres</button>
          <button onclick={() => this.openStatsModal()}>Infos</button>
        </div>
        {IS_DEV && <DevToolsComponent />}
      </footer>
    );
  }
}

customElements.define("game-footer", FooterComponent);

export default FooterComponent;
