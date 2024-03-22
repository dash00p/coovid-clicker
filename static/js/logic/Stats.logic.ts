import Core from "./core/Core.logic";
import Game from "./Game.logic";
import Perk from "./Perk.logic";
import Building from "./Building.logic";
import Clicker from "./Clicker.logic";

class Stats extends Core<Stats> {
    list: IStat;

    constructor() {
        super();
        this.update();
    }

    update(): IStat {
        this.list = {
            clickCount: Clicker.getInstance().count,
            totalEarnings: Game.getInstance().totalEarnings,
            buildingCount: Building.getInstance().buildingCount,
            perkCount: Perk.getInstance().count
        };

        return this.list;
    }
}

export default Stats;