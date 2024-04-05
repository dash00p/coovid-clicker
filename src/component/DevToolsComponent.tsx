import { log } from "../helper/Console.helper";
import Game from "../logic/Game.logic";
import Perk from "../logic/Perk.logic";
import ElementRender from "../logic/core/Element.logic";
import DeprecatedStyledComponent from "./common/StyledComponent";

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

class DevToolsComponent extends DeprecatedStyledComponent {
  constructor(props: object = null) {
    super({ ...props, style });
  }

  newRender() {
    return (
      <div>
        <h3>Dev Tools</h3>
        <button onclick={() => Perk.getInstance().selectRandomPerk()}>New perk</button>
        <button onclick={() => Perk.getInstance().clearActivePerks()}>Clear all perks</button>
        <button onclick={() => Perk.getInstance().createEphemeral()}>New ephemeral</button>
        <button onclick={() => Game.getInstance().reset()}>New game</button>
        <button onclick={() => log(JSON.parse(atob(localStorage.getItem("save"))))}>Display save</button>
        <button onclick={() => {
          const game = Game.getInstance();
          game.incrementAmount(game.getAmount())
        }
        }>Double amount</button>
      </div>
    );
  }
}

customElements.define("game-dev-tools", DevToolsComponent);

export default DevToolsComponent;