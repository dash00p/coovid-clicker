class Singleton<T extends Singleton<T>> {
    private static _instances: Map<Function, any> = new Map();

    constructor() {
        if (Singleton._instances.get(this.constructor)) {
            return Singleton._instances.get(this.constructor);
        }
        Singleton._instances.set(this.constructor, this);
    }

    static get instances(): Map<Function, any> {
        return Singleton._instances;
    }


    static getInstance<T>(this: new () => T): T {
        if (!Singleton._instances.get(this)) {
            Singleton._instances.set(this, new this());
        }
        return (Singleton._instances.get(this)) as T;
    }

    static deleteInstance<T>(this: new () => T): void {
        Singleton._instances.delete(this);
    }
}

export default Singleton;