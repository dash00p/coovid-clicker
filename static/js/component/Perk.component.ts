import { IPerk } from "../collection/Perk.collection";
import CoreComponent, { ICoreComponentProps, ICoreComponentsState } from "./Core.component";

interface IPerkState extends ICoreComponentsState {
    expirationTimestamp: number;
  }

export interface IPerkComponentProps extends IPerk, ICoreComponentProps {}

class PerkComponent extends CoreComponent {
    static customType: string = "game-perk";
    state: IPerkState;

    constructor(props: IPerkComponentProps = null) {
        super(props);
        this.state.expirationTimestamp = Date.now() + props.duration;
        this.create("li", `${props.name} (<span></span>s)`);
        this.setInterval(() => this.rerender(), 900);
        this.rerender();
        this.kill(props.duration);
    }

    rerender(): void {
        this.updateContent(
            this.find("span"),
            `${Math.floor((this.state.expirationTimestamp - Date.now()) / 1000)}`
          );
    }
}

customElements.define(PerkComponent.customType, PerkComponent);

export default PerkComponent;
