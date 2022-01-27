import DomHandler from "./DomHandler";
import { gameInstance } from "./Game.logic";
import { perkInstance } from "./Perk.logic";

class Clicker {
  private static _instance: Clicker;
  amount: number;
  count: number;
  increment: number; // current click value
  baseIncrement: number;

  constructor(count: number = 0, increment: number = 1, amount: number = 0) {
    if (Clicker._instance) {
      return Clicker._instance;
    }
    Clicker._instance = this;
    console.log("Clicker alive");
    this.count = count;
    this.increment = increment;
    this.baseIncrement = increment;
  }

  triggerClick(): number {
    console.log("Trigger click");
    return gameInstance().incrementAmount(this.addClick());
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
    if(perkInstance().activePerks.length) {
      perkInstance().applyPassivePerk();
    } else {
      this.increment = this.baseIncrement;
      DomHandler.clicker.updateIncrement(this.increment);
    }
  }

  static getInstance(): Clicker {
    return Clicker._instance;
  }
}

export const clickerInstance: () => Clicker = (): Clicker => {
  return Clicker.getInstance();
};

export default Clicker;
