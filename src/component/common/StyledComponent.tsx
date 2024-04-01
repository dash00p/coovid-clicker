import DeprecatedCoreComponent from "./CoreComponent";

abstract class DeprecatedStyledComponent<T extends IStyledComponentProps = IStyledComponentProps> extends DeprecatedCoreComponent<T> {
    constructor(props: T & { style?: string } = null) {
        super(props);
        this.setStyle(props.style);
    }

    // should be 
    abstract newRender(): any;
    /*newRender(): any {
      throw new Error("Method not implemented.");
    }*/

    connectedCallback() {
        this.appendChild(this.newRender());
        this.baseCallbackAfterConnect();
        this.callbackAfterConnect();
    }

    disconnectedCallback() {
        this.clearActiveJobs();
    }

    baseCallbackAfterConnect() {
    }

    // optionally implemented in child class.
    callbackAfterConnect() {

    }
}

export default DeprecatedStyledComponent;