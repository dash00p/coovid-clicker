import { log } from "../helper/Console.helper";
import Core from "./core/Core.logic";



class Params extends Core<Params> {
    private _list: IParams = {
        soundActive: true,
    };

    constructor() {
        super();
    }


    get list(): IParams {
        return this._list;
    }

    toggleSound(): void {
        this._list.soundActive = !this._list.soundActive;
        log(`Sound is now ${this._list.soundActive ? "on" : "off"}`);
    }

    loadFromSave(savedParams: IParams): void {
        this._list = savedParams;
    }

    save(): IParams {
        return this._list;
    }
}

export default Params;
