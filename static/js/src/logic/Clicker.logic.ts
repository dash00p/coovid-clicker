import { gameInstance } from "./Game.js";

class Clicker {
  private static _instance;
  amount;
  count;
  increment; //current click value

  constructor(count = 0, increment = 1, amount = 0) {
    if (Clicker._instance) return Clicker._instance;
    Clicker._instance = this;
    console.log("Clicker alive");
    this.count = count;
    this.increment = increment;
  }

  triggerClick() {
    console.log("Trigger click");
    return gameInstance().incrementAmount(this.addClick());
  }

  addClick() {
    this.count++;
    return this.increment;
  }

  get value() {
    return this.increment;
  }

  set value(newValue) {
    this.increment = newValue;
  }

  static getInstance(){
    return Clicker._instance;
  }
}

export const clickerInstance = () => {
  return Clicker.getInstance();
}

export default Clicker;
