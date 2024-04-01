import ElementRender from "../../logic/core/Element.logic";
import BaseComponent from "./BaseComponent";

const style: string = `
    .modal {
        display: block; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto; /* Enable scroll if needed */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        opacity: 0;
        transition: opacity 0.4s ease;
    }

    
    .modal-content {
        background-color: #fefefe;
        color: #222;
        margin: 15% auto; /* 15% from the top and centered */
        padding: 20px;
        border: 1px solid #888;
        width: 45%; /* Could be more or less, depending on screen size */
        transform: translateY(-100%);
        transition: transform .75s ease-out;
        border-radius: 10px;
    }

    .modal.show {
        opacity: 1;
    }

    .modal.show .modal-content {
        transform: translateY(0);
      }
    
    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }
    
    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
`;

export interface IModalComponentProps extends IStyledComponentProps {
    onClose?: () => void;
}

class ModalComponent extends BaseComponent<IModalComponentProps> {
    private modal: HTMLElement;

    constructor(props: IModalComponentProps = null) {
        super({ ...props, style: style + props?.style });
    }

    callbackAfterConnect() {
        this.modal.className += ' show';
    }

    close() {
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.kill();
            this.props.onClose();
        }, 300);
    }


    render() {
        this.modal = (
            <div className="modal" onclick={(ev: MouseEvent) => { if (ev.target === this.modal) this.close() }}>
                <div className="modal-content">
                    <span className="close" id="closeModalBtn" onclick={() => this.close()}>&times;</span>
                    {this.props.children}
                </div>
            </div>
        );
        return this.modal;
    }
}

customElements.define("game-modal", ModalComponent);

export default ModalComponent;