import { gameInstance } from "./Game";

class Clicker {
  private static _instance: Clicker;
  amount: number;
  count: number;
  increment: number; // current click value

  constructor(count: number = 0, increment: number = 1, amount: number = 0) {
    if (Clicker._instance) {
      return Clicker._instance;
    }
    Clicker._instance = this;
    console.log("Clicker alive");
    this.count = count;
    this.increment = increment;
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

  static getInstance(): Clicker {
    return Clicker._instance;
  }
}

export const clickerInstance: () => Clicker = (): Clicker => {
  return Clicker.getInstance();
};

export default Clicker;
