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
}

export default Core;