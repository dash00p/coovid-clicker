import BaseComponent from "./common/BaseComponent";
import ElementRender from "../logic/core/Element.logic";
import Modal from "../logic/Modal.logic";
import ModalComponent from "./common/ModalComponent";


class ModalContainerComponent extends BaseComponent {
    declare state: {
        modalList: ModalComponent[]
    }

    constructor(props: object = {}) {
        super({ ...props });
        this.observe(Modal.getInstance().state, 'modalList');
    }

    render() {
        return (
            <>
                {this.state.modalList.map(modal => modal
                )}
            </>
        );
    }
}

customElements.define("game-modal-container", ModalContainerComponent);

export default ModalContainerComponent;
