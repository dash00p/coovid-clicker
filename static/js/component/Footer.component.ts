import StyledComponent from "./common/Styled.component";
import CoreComponent from "./common/Core.component";
import DevToolsComponent from "./DevTools.component";
import DomHandler from "../logic/DomHandler";
import StatsComponent from "./modal/Stats.component";
import ParamsComponent from "./modal/Params.component";
import Game from "../logic/Game.logic";

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

class FooterComponent extends StyledComponent {
  constructor(props: object = null) {
    super({ ...props, style });
    const footer = this.create("footer", `<span>version: ${Game.getInstance().version}</span>`);
    if (IS_DEV) this.prependChild(new DevToolsComponent(), footer);
    //this.prependChild(CoreComponent.createElement("div", `Menu x`), footer);
    this.renderMenu(footer);
  }

  renderMenu(footerContainer: HTMLElement) {
    const perkButton: IEnhancedHTMLElement = document.createElement("button");
    perkButton.textContent = "Infos";
    perkButton.onclick = () => {
      this.openStatsModal();
    };

    const perk2Button: IEnhancedHTMLElement = document.createElement("button");
    perk2Button.textContent = "Paramètres";
    perk2Button.onclick = () => {
      this.openParamsModal();
    };

    const menu = this.prependChild(CoreComponent.createElement("div", `<h3>Menu</h3>`), footerContainer);
    this.addElements(menu, perkButton, perk2Button);
  }

  openStatsModal() {
    DomHandler.layout.appendModal(new StatsComponent());
  }

  openParamsModal() {
    DomHandler.layout.appendModal(new ParamsComponent());
  }
}

customElements.define("game-footer", FooterComponent);

export default FooterComponent;
