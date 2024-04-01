import BaseComponent from "../component/common/BaseComponent";
import Core from "./core/Core.logic";

interface IModalState {
    modalList: BaseComponent[];
}

class Modal extends Core<Modal> {
    declare state: IModalState

    constructor() {
        super();
        this.state = this.setProxy({
            modalList: []
        });
    }

    addModal<T extends BaseComponent>(modal: T): void {
        this.state.modalList.push(modal);
    }

    removeModal<T extends BaseComponent>(modal: T): void {
        // use findIndex to remove the modal
        const index = this.state.modalList.findIndex((m) => m === modal);
        if (index !== -1) {
            this.state.modalList.splice(index, 1);
        }
    }
    ;
}

export default Modal;