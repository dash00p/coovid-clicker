import CoreComponent from "./Core.component";
import { gameInstance } from "../logic/Game.logic";

const style: string = `
    footer {
        position: fixed;
        bottom: 0;
        left: 0;
        text-align: right;
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }
`;

class FooterComponent extends CoreComponent {
  constructor(props: object = null) {
    super(props);
    this.setHTML(`<footer>version: ${gameInstance().version}</footer>`);
    this.setStyle(style);
  }
}

customElements.define("game-footer", FooterComponent);

export default FooterComponent;