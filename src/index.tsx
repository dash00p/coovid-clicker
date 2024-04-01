import BaseComponent from "./component/common/BaseComponent";
import ElementRender from "./logic/core/Element.logic";

import "./css/game.scss";

import GameLogic from "./logic/Game.logic";
import LayoutComponent from "./component/LayoutComponent";
new GameLogic();

class GameComponent extends BaseComponent {
    constructor(props: object = {}) {
        super({ ...props });
    }

    render() {
        return (
            <>
                <LayoutComponent />
            </>
        );
    }
}
customElements.define("game-container", GameComponent);

const gameComponent = document.createElement('game-container') as GameComponent;
document.body.appendChild(gameComponent);