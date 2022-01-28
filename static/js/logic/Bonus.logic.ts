import { gameInstance } from "./Game.logic";
import { bonusList } from "../collection/Bonus.collection";
import { warn } from "../helper/Console.helper";
import { buildInstance } from "./Building.logic";
import DomHandler from "./DomHandler";
// this class represents a game bonus, should not be confused with the "Perk" class.
class Bonus {
  private static _instance: Bonus;
  private _availableBonus: IBonus[];
  totalMultiplicator: number;

  constructor() {
    if (Bonus._instance) return Bonus._instance;
    Bonus._instance = this;
    this._availableBonus = [];
    this.totalMultiplicator = 1;
  }

  checkAvailableBonus(): void {
    const availableBonusList: number[] = this._availableBonus.map((b) => b.id);
    const newBonuses = bonusList.filter(
      (b) =>
        !availableBonusList.includes(b.id) &&
        b.neededProduction <= buildInstance().totalProduction
    );
    for (const bonus of newBonuses) {
      this._availableBonus.push(bonus);
      DomHandler.renderBonus(bonus);
    }
  }

  loadBonusFromSave(savedBonuses: IBaseBonus[]): void {
    for (const baseBonus of savedBonuses) {
      const bonus = bonusList.find((b) => (b.id = baseBonus.id));
      if (bonus) {
        this._availableBonus.push({
          isPurchased: true,
          ...bonus,
        });
        //DomHandler.renderBonus(bonus);
      }
    }
    this.checkAvailableBonus();
  }

  saveBonuses(): IBaseBonus[] {
    return this._availableBonus
      .filter((b) => b.isPurchased)
      .map((b) => {
        return {
          id: b.id,
        };
      });
  }

  addBonus(bonusId: number): IBonus {
    const bonusIndex = this._availableBonus.findIndex( b => b.id === bonusId);
    if (bonusIndex === -1) {
      warn("Invalid attempt to apply a bonus");
      return;
    }

    let newBonus = this._availableBonus[bonusIndex];

    if(newBonus.cost > gameInstance().currentAmount) {
        warn("Bonus not affordable");
        return;
    }

    if(newBonus.isPurchased) {
        warn("Bonus already unlocked");
        return;
    }
    newBonus.isPurchased = true;
    DomHandler.renderCounter(
        gameInstance().incrementAmount(-newBonus.cost)
      );
    this.applyBonus();
    return newBonus;
  }

  applyBonus() {
    let multiplicator = 1;
    for (const bonus of this._availableBonus.filter((b) => b.isPurchased)) {
      multiplicator *= bonus.value;
    }
    this.totalMultiplicator = multiplicator;
  }

  static getInstance(): Bonus {
    return Bonus._instance;
  }

  static deleteInstance(): void {
    delete Bonus._instance;
  }
}

export const bonusInstance: () => Bonus = (): Bonus => {
  return Bonus.getInstance();
};

export default Bonus;
