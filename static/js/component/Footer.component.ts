import CoreComponent from "./Core.component";
import { gameInstance } from "../logic/Game.logic";
import DevToolsComponent from "./DevTools.component";

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
`;

class FooterComponent extends CoreComponent {
  constructor(props: object = null) {
    super(props);
    this.setHTML(
      `<footer><span>version: ${gameInstance().version}</span></footer>`
    );
    if (IS_DEV) this.prependChild(new DevToolsComponent(), this.find("footer"));
    this.setStyle(style);
  }
}

customElements.define("game-footer", FooterComponent);

export default FooterComponent;
