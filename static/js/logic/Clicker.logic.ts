import DomHandler from "./DomHandler";
import { log } from "../helper/Console.helper";
import Perk from "./Perk.logic";
import Game from "./Game.logic";
import Core from "./core/Core.logic";

class Clicker extends Core<Clicker> {
  amount: number;
  count: number;
  increment: number; // current click value
  baseIncrement: number;

  constructor(count: number = 0, increment: number = 1, amount: number = 0) {
    super();
    log("Clicker alive", 3);
    this.count = count;
    this.increment = increment;
    this.baseIncrement = increment;
  }

  triggerClick(): number {
    log("Trigger click", 3);
    return Game.getInstance().incrementAmount(this.addClick());
  }

  addClick(): number {
    this.count++;
    return this.increment;
  }

  get value(): number {
    return this.increment;
  }

  set value(newValue: number) {
    this.increment = newValue;
  }

  refreshIncrementFromBuildings(totalBuildingsProduction: number): void {
    this.baseIncrement = Math.max(totalBuildingsProduction / 10, 1);
    if (Perk.getInstance().activePerks.length) {
      Perk.getInstance().applyPassivePerk();
    } else {
      this.increment = this.baseIncrement;
      DomHandler.clicker.updateIncrement(this.increment);
    }
  }
}

export default Clicker;