import { log } from "../helper/Console.helper";
import Perk from "./Perk.logic";
import Game from "./Game.logic";
import Core from "./core/Core.logic";
import EphemeralComponent from "../component/EphemeralComponent";

class Clicker extends Core<Clicker> {
  state: {
    increment: number;
  }

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
    this.state = this.setProxy({ increment: this.increment });
  }

  triggerClick(): number {
    log("Trigger click", 3);
    new EphemeralComponent({
      icon: "random",
      event: memeEventType.click
    });
    return Game.getInstance().incrementAmount(this.addClick());
  }

  addClick(): number {
    this.count++;
    return this.increment;
  }

  get value(): number {
    return this.state.increment;
  }

  set value(newValue: number) {
    this.state.increment = newValue;
  }

  // TODO: check if not deprecated
  refreshIncrementFromBuildings(totalBuildingsProduction: number): void {
    this.baseIncrement = Math.max(totalBuildingsProduction / 10, 1);
    if (Perk.getInstance().activePerks.length) {
      Perk.getInstance().applyPassivePerk();
    } else {
      this.state.increment = this.baseIncrement;
    }
  }
}

export default Clicker;