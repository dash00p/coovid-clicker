// Will replace CoreComponent.tsx. Comments to remove when done.

import { addWatcher } from "../../helper/Dom.helper";
import { realSetInterval } from "../../helper/Guard.helper";

class BaseComponent<T extends IBaseComponentProps = IBaseComponentProps> extends HTMLElement {
    props: T;
    state?: any;
    shadowRoot: ShadowRoot;
    private _activeJobs: number[];
    private _watchers: { objectObserved: any, propertyObservers: string, callback: () => void }[] = [];

    constructor(props: T) {
        super();
        if (new.target === BaseComponent) {
            throw new TypeError("Cannot construct BaseComponent instance directly");
        }

        this.props = props;
        this.state = {};
        this._activeJobs = [];

        if (!props.disableShadow)
            this.shadowRoot = this.attachShadow({ mode: "open" });

        this.setStyle(props?.style);
    }

    connectedCallback() {
        if (this.shadowRoot)
            this.shadowRoot.appendChild(this.render());
        else
            this.appendChild(this.render());

        this.baseCallbackAfterConnect();
        // ensure callbackAfterConnect is called after render.
        setTimeout(() => {
            this.callbackAfterConnect();
        }, 0);
    }

    /** Called when component is inserted in DOM.
     * To clean if not needed.
     *  */
    baseCallbackAfterConnect() {
    }

    // optionally implemented in child class.
    callbackAfterConnect() { }

    /** Called when component is removed from DOM. */
    disconnectedCallback() {
        this._clearActiveJobs();
        this.callbackAfterRemove();
        this._clearObservers();
        for (let prop in this) {
            if (this.hasOwnProperty(prop)) {
                delete this[prop];
            }
        }
    }

    // optionally implemented in child class.
    callbackAfterRemove() { }

    private _clearActiveJobs() {
        for (const job of this._activeJobs) {
            clearInterval(job);
            const jobIndex = this._activeJobs.indexOf(job);
            if (jobIndex > -1) {
                this._activeJobs.splice(jobIndex, 1);
            }
        }
    }

    private _clearObservers() {
        for (const observerToDelete of this._watchers) {
            let observers;
            const propertyObserved = observerToDelete.objectObserved[observerToDelete.propertyObservers];

            if (typeof propertyObserved !== 'object') {
                observers = observerToDelete.objectObserved._observers;
            } else {
                observers = propertyObserved._observers;
            }

            if (!observers) continue;

            if (observers["self"])
                observers["self"].delete(observerToDelete.callback);

            if (observers[observerToDelete.propertyObservers])
                observers[observerToDelete.propertyObservers].delete(observerToDelete.callback);
        }
    }

    kill(timer = 0) {
        setTimeout(() => {
            this.remove();
        }, timer);
    }

    static createRef() {
        const refObject = {
            current: null,
            bind: (ref: HTMLElement) => {
                refObject.current = ref;
                return ref;
            }
        };

        return refObject;
    }

    // Implemented in child class.
    render(): any { }

    setStyle(style: string, replaceCurrentSheet = false) {
        if (style) {
            const stylesheet: HTMLStyleElement = replaceCurrentSheet ? this.shadowRoot.querySelector('style') : document.createElement("style");
            stylesheet.textContent = style;
            this.shadowRoot.prepend(stylesheet);
        }
    }

    // State proxy handler to retrigger render on state change.
    observe(obj: any, property: string, stateProperty?: string, callbackFunction?: () => void) {
        const callback = () => {
            // Update state value & trigger rerender.
            this.state[stateProperty || property] = obj[property];
            if (callbackFunction) {
                callbackFunction.bind(this)();
            }
            else this.rerender();
        };
        this._watchers.push({
            objectObserved: obj,
            propertyObservers: property,
            callback
        });
        addWatcher(obj, property, callback);

        // Called only once to set initial state value.
        this.state[stateProperty || property] = obj[property];
    }

    // Lifecycle method implemented in child class before rerendering.
    componentWillUpdate() { }

    // Lifecycle methods implemented in child class after rerendering.
    componentDidUpdate() { }

    rerender() {
        this.componentWillUpdate();
        let newContent = this.render();
        this.shadowRoot.replaceChildren(newContent);
        this.setStyle(this.props?.style);
        this.componentDidUpdate();
    }

    setInterval(
        handler: TimerHandler,
        timeout?: number,
        ...args: any[]
    ): ReturnType<typeof setInterval> {
        const interval = realSetInterval(handler, timeout, ...args);
        this._activeJobs.push(interval);
        return interval;
    }
}

export default BaseComponent;