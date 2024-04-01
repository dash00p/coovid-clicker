import ModalComponent from "../common/ModalComponent";
import Params from "../../logic/Params.logic";
import ElementRender from "../../logic/core/Element.logic";
import BaseComponent from "../common/BaseComponent";
import Modal from "../../logic/Modal.logic";

class ModalParamsComponent extends BaseComponent {
    constructor(props: object = null) {
        super({ ...props });
    }

    callbackAfterRemove() {
        Modal.getInstance().removeModal(this);
    }

    render() {
        return (
            <ModalComponent onClose={() => { this.kill() }}>
                <h2>Paramètres</h2>
                <ul>
                    <li>
                        <label>Activer le son <input type="checkbox" name="param_sound" checked={Params.getInstance().list.soundActive} onclick={() => { Params.getInstance().toggleSound() }} /></label>
                    </li>
                </ul>
            </ModalComponent>);
    }
}

customElements.define("game-modal-params", ModalParamsComponent);

export default ModalParamsComponent;
