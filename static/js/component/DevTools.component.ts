import { log } from "../helper/Console.helper";
import Game from "../logic/Game.logic";
import Perk from "../logic/Perk.logic";
import StyledComponent from "./common/Styled.component";

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

class DevToolsComponent extends StyledComponent {
  constructor(props: object = null) {
    super({ ...props, style });
    const container = this.create("div", `<h3>Dev tools</h3>`);

    const perkButton: IEnhancedHTMLElement = document.createElement("button");
    perkButton.textContent = "New perk";
    perkButton.onclick = () => {
      Perk.getInstance().selectRandomPerk();
    };
    this.appendChild(perkButton, container);

    const perkClearButton: IEnhancedHTMLElement =
      document.createElement("button");
    perkClearButton.textContent = "Clear all perks";
    perkClearButton.onclick = () => {
      Perk.getInstance().clearActivePerks();
    };
    this.appendChild(perkClearButton, container);

    const ephemeralButton: IEnhancedHTMLElement =
      document.createElement("button");
    ephemeralButton.textContent = "New ephemeral";
    ephemeralButton.onclick = () => {
      Perk.getInstance().createEphemeral();
    };
    this.appendChild(ephemeralButton, container);

    const resetGame: IEnhancedHTMLElement = document.createElement("button");
    resetGame.textContent = "New game";
    resetGame.onclick = () => {
      Game.getInstance().reset();
    };
    this.appendChild(resetGame, container);

    const displaySave: IEnhancedHTMLElement = document.createElement("button");
    displaySave.textContent = "Display save";
    displaySave.onclick = () => {
      log(JSON.parse(atob(localStorage.getItem("save"))), 3);
    };
    this.appendChild(displaySave, container);

    const doubleAmount: IEnhancedHTMLElement = document.createElement("button");
    doubleAmount.textContent = "Double amount";
    doubleAmount.onclick = () => {
      const game = Game.getInstance();
      game.incrementAmount(game.getAmount());
    };
    this.appendChild(doubleAmount, container);
  }
}

customElements.define("game-dev-tools", DevToolsComponent);

export default DevToolsComponent;
