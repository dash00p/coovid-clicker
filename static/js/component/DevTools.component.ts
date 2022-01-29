import { gameInstance } from "../logic/Game.logic";
import { perkInstance } from "../logic/Perk.logic";
import CoreComponent from "./Core.component";

const style: string = `
    div {
        float: left;
    }

    h3 {
        margin:0;
        display: inline-block;
    }

    button {
        margin-left: 5px;
    }
`;

class DevToolsComponent extends CoreComponent {
  constructor(props: object = null) {
    super(props);
    this.setHTML(`<div><h3>Dev tools</h3></div>`);

    const perkButton: IEnhancedHTMLElement = document.createElement("button");
    perkButton.textContent = "New perk";
    perkButton.onclick = () => {
      perkInstance().selectRandomPerk();
    };
    this.appendChild(perkButton, this.find("div"));

    const perkClearButton: IEnhancedHTMLElement =
      document.createElement("button");
    perkClearButton.textContent = "Clear all perks";
    perkClearButton.onclick = () => {
      perkInstance().clearActivePerks();
    };
    this.appendChild(perkClearButton, this.find("div"));

    const ephemeralButton: IEnhancedHTMLElement =
      document.createElement("button");
    ephemeralButton.textContent = "New ephemeral";
    ephemeralButton.onclick = () => {
      perkInstance().createEphemeral();
    };
    this.appendChild(ephemeralButton, this.find("div"));

    const resetGame: IEnhancedHTMLElement = document.createElement("button");
    resetGame.textContent = "New game";
    resetGame.onclick = () => {
      gameInstance().reset();
    };
    this.appendChild(resetGame, this.find("div"));

    this.setStyle(style);
  }
}

customElements.define("game-dev-tools", DevToolsComponent);

export default DevToolsComponent;
