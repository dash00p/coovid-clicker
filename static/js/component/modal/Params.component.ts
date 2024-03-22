import ModalComponent, { IModalComponentProps } from "../common/Modal.component";
import CoreComponent from "../common/Core.component";
import Params from "../../logic/Params.logic";

class ParamsComponent extends ModalComponent {
    constructor(props: IModalComponentProps = null) {
        super(props);

        const params = Params.getInstance();

        this.find(".modal-content").appendChild(CoreComponent.createElement("div", `<h2>Paramètres</h2>
        <ul>
            <li>Activer le son <input type="checkbox" ${params ? "checked" : ""}></li>
            </li>
        </ul>`)); // Use CoreComponent to call createElement
    }
}

customElements.define("game-params", ParamsComponent);

export default ParamsComponent;
