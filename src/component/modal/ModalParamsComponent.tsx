import ModalComponent from "../common/ModalComponent";
import Params from "../../logic/Params.logic";
import ElementRender from "../../logic/core/Element.logic";
import BaseComponent from "../common/BaseComponent";
import Modal from "../../logic/Modal.logic";
import Game from "../../logic/Game.logic";

class ExportParamComponent extends BaseComponent {
    declare state: {
        save: string;
    };

    constructor(props: object = null) {
        super({ ...props });
    }

    render() {
        return (
            <li>
                <button
                    onclick={() => {
                        this.state.save = localStorage.getItem("save");
                        this.rerender();
                    }}
                >Exporter la sauvegarde de la partie</button>
                {this.state.save && <textarea
                    autofocus
                    onfocus={(event) => {
                        event.target.select()
                    }}
                    style={{
                        marginTop: '10px',
                        color: 'black',
                        minWidth: '100%',
                        minHeight: '120px'
                    }}
                >{this.state.save}</textarea>}
            </li>);
    }

}

customElements.define("game-modal-params-export", ExportParamComponent);

class ImportParamComponent extends BaseComponent {
    declare state: {
        showInput: boolean;
    };

    constructor(props: object = null) {
        super({ ...props });
    }

    render() {
        const ref = BaseComponent.createRef()
        return (
            <li>
                <button
                    onclick={() => {
                        this.state.showInput = true;
                        this.rerender();
                    }}
                >Importer une partie</button>
                {this.state.showInput && <div>
                    {ref.bind(<textarea
                        autofocus
                        style={{
                            marginTop: '10px',
                            color: 'black',
                            minWidth: '100%',
                            minHeight: '120px'
                        }}
                        placeholder="Insérer le contenu de la sauvegarde ici. Exemple de format: eyJ2ZXJzaW9uIjoiMC4zLjJfMjAyNC0wNC0wNSIsImJ1aWxkaW5ncyI6W3siaWQiOjEsImxldmVsIjoxNywiYWN0aXZlVXBncmFkZXMiOltdfSx7ImlkIjoyLCJsZXZlbCI6MTAsImFjdGl2ZVVwZ3JhZGVzIjpbeyJpZCI6MjB9XX0seyJpZCI6NCwibGV2ZWwiOjExLCJhY3RpdmVVcGdyYWRlcyI6W3siaWQiOjQwfV19LHsiaWQiOjUsImxldmVsIjowLCJhY3RpdmVVcGdyYWRlcyI6W119XSwiY3VycmVudEFtb3VudCI6MTM2OTU4MDIuMjA2OTg5NTk0LCJjdXJyZW50RGF0ZSI6IjIwMjQtMDQtMDZUMTQ6NTY6MjUuMzQ3WiIsInN0YXJ0RGF0ZSI6IjIwMjQtMDQtMDZUMTQ6NTY6MjUuMzQ3WiIsInN0YXRzIjp7ImNsaWNrQ291bnQiOjAsInRvdGFsRWFybmluZ3MiOjAsImJ1aWxkaW5nQ291bnQiOjAsInBlcmtDb3VudCI6MH0sImJvbnVzIjpbXSwicGFyYW1zIjp7InNvdW5kQWN0aXZlIjp0cnVlfX0="
                    ></textarea>)}
                    <button
                        onclick={() => {
                            Game.getInstance().importSave(ref.current.value);
                        }}
                    >Valider l'import</button>
                </div>}

            </li>);
    }

}

customElements.define("game-modal-params-import", ImportParamComponent);

class ModalParamsComponent extends BaseComponent {
    declare state: {
        save: string;
    };

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
                    <ExportParamComponent />
                    <ImportParamComponent />
                </ul>
            </ModalComponent>);
    }
}

customElements.define("game-modal-params", ModalParamsComponent);

export default ModalParamsComponent;
