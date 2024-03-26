import ModalComponent, { IModalComponentProps } from "../common/Modal.component";
import CoreComponent from "../common/Core.component";
import Params from "../../logic/Params.logic";

class ParamsComponent extends ModalComponent {
    constructor(props: IModalComponentProps = null) {
        super(props);

        const params = Params.getInstance();

        this.find(".modal-content").appendChild(CoreComponent.createElement("div", `<h2>Paramètres</h2>
        <ul>
        </ul>`)); // Use CoreComponent to call createElement

        const paramSound: IEnhancedHTMLElement = document.createElement("li");
        paramSound.innerHTML = `<label>Activer le son <input type="checkbox" name="param_sound"  ${params.list.soundActive ? "checked" : ""}/></label>`;
        paramSound.querySelector("input").addEventListener("change", (e) => {
            params.toggleSound();
        });

        this.find(".modal-content ul").appendChild(paramSound);
    }
}

customElements.define("game-params", ParamsComponent);

export default ParamsComponent;
