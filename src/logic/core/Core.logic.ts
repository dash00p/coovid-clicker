import Game from "../Game.logic";
import Singleton from "./Singleton.logic";

class Core<T extends Core<T>> extends Singleton<T> {
    protected _jobs: number[];

    constructor() {
        super();
        this._jobs = [];
    }

    static dispose<T extends Core<T>>(that: new () => T): void {
        const classInstance: T = (Singleton.getInstance.bind(that) as () => T)();
        classInstance.clearActiveJobs();
        Singleton.deleteInstance.bind(that)();
    }

    static disposeAll(): void {
        for (const instance of Singleton.instances.values()) {
            Core.dispose(instance.constructor);
        }
    }

    clearActiveJobs() {
        for (const job of this._jobs) {
            clearInterval(job);
            const jobIndex = this._jobs.indexOf(job);
            if (jobIndex > -1) {
                this._jobs.splice(jobIndex, 1);
            }
        }
    }

    setProxy(initialValue: any): any {
        const handler = {
            set: (target: any, property: any, value: any) => {
                let propertyToObserve = property;
                if (typeof value === 'object' && value !== null) {
                    // Check if the object is not already a proxy and also if the root object hasn't any observers to avoid deep proxying on complex objects.
                    if (!value.isProxy && !target._observers?.self) value = this.setProxy(value);
                    propertyToObserve = "self";
                } else if (Array.isArray(target) && property === "length" && value === 0) {
                    propertyToObserve = "self";
                }
                target[property] = value;
                if (!Game.getInstance().state.onBackground && target._observers && target._observers[propertyToObserve]) {
                    target._observers[propertyToObserve].forEach(observer => observer());
                }
                return true;
            },
            get: (target: any, property: any) => {
                if (property === 'isProxy') {
                    return true;
                }
                return target[property];
            }
        };

        if (typeof initialValue === 'object' && initialValue !== null) {
            for (let key in initialValue) {
                if (typeof initialValue[key] === 'object' && initialValue[key] !== null) {
                    initialValue[key] = this.setProxy(initialValue[key]);
                }
            }
        }

        return new Proxy(this.initProxy(initialValue), handler);
    }

    initProxy(initialValue: any): any {
        if (initialValue._observers) {
            throw new Error("Initial value already has observers");
        }
        initialValue._observers = {};
        return initialValue;
    }
}

export default Core;