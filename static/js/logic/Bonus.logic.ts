import { bonusList } from "../collection/Bonus.collection";
import { warn } from "../helper/Console.helper";
import DomHandler from "./DomHandler";
import Game from "./Game.logic";
import Building from "./Building.logic";
import Core from "./core/Core.logic";
import Clicker from "./Clicker.logic";
// this class represents a game bonus, should not be confused with the "Perk" class.
class Bonus extends Core<Bonus> {
  private _availableBonus: IBonus[];
  productionMultiplicator: number;
  perkRoutineTimerReducer: number;
  perkEffectTimerMultiplicator: number;
  autoClickMultiplicator: number;
  buildingCountTrigger: number;
  pentaClickMultiplicator: number;

  constructor() {
    super();
    this._availableBonus = [];
    this.productionMultiplicator =
      this.perkRoutineTimerReducer =
      this.perkEffectTimerMultiplicator =
      this.autoClickMultiplicator =
      this.pentaClickMultiplicator =
      1;
  }

  get availableBonus(): IBonus[] {
    return this._availableBonus;
  }

  checkAvailableBonus(): void {
    const availableBonusList: number[] = this._availableBonus.map((b) => b.id);
    const newBonuses = bonusList.filter(
      (b) =>
        !availableBonusList.includes(b.id) &&
        b.neededProduction <= Building.getInstance().totalProduction
    );
    for (const bonus of newBonuses) {
      this._availableBonus.push(bonus);
      DomHandler.renderBonus(bonus);
    }
  }

  loadBonusFromSave(savedBonuses: IBaseBonus[]): void {
    for (const baseBonus of savedBonuses) {
      const bonus = bonusList.find((b) => b.id === baseBonus.id);
      if (bonus) {
        this._availableBonus.push({
          isPurchased: true,
          ...bonus,
        });
        //DomHandler.renderBonus(bonus);
      }
    }
    this.applyBonus();
    this.checkAvailableBonus();
    DomHandler.renderAllBuildings();
    Clicker.getInstance().refreshIncrementFromBuildings(
      Building.getInstance().getTotalProduction()
    );
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
    const bonusIndex = this._availableBonus.findIndex((b) => b.id === bonusId);
    if (bonusIndex === -1) {
      warn("Invalid attempt to apply a bonus");
      return;
    }

    let newBonus = this._availableBonus[bonusIndex];

    if (newBonus.cost > Game.getInstance().currentAmount) {
      warn("Bonus not affordable");
      return;
    }

    if (newBonus.isPurchased) {
      warn("Bonus already unlocked");
      return;
    }
    newBonus.isPurchased = true;
    DomHandler.renderCounter(Game.getInstance().incrementAmount(-newBonus.cost));
    this.applyBonus();
    if (newBonus.type === bonusType.productionMultiplicator) {
      DomHandler.renderAllBuildings();
    }
    return newBonus;
  }

  applyBonus() {
    let productionMultiplicator = 1,
      perkTimerReducer = 1,
      perkEffectMultiplicator = 1,
      autoClickMultiplicator = 1,
      pentaClickMultiplicator = 1;
    for (const bonus of this._availableBonus.filter((b) => b.isPurchased)) {
      switch (bonus.type) {
        case bonusType.productionMultiplicator:
          productionMultiplicator *= bonus.value;
          break;
        case bonusType.perkTimerReducer:
          perkTimerReducer *= bonus.value;
          break;
        case bonusType.perkEffectMultiplicator:
          perkEffectMultiplicator *= bonus.value;
          break;
        case bonusType.autoClickMultiplicator:
          autoClickMultiplicator *= bonus.value;
          break;
        case bonusType.buildingCountMultiplicator:
          this.buildingCountTrigger = bonus.value2;
          const buildingCount = Building.getInstance().buildingCount;
          const multiplicator =
            Math.trunc(buildingCount / bonus.value2) * bonus.value;
          productionMultiplicator *= 1 + multiplicator;
          break;
        case bonusType.perkClickMultiplicator:
          pentaClickMultiplicator *= bonus.value;
          break;
      }
    }
    this.productionMultiplicator = productionMultiplicator;
    this.perkRoutineTimerReducer = perkTimerReducer;
    this.perkEffectTimerMultiplicator = perkEffectMultiplicator;
    this.autoClickMultiplicator = autoClickMultiplicator;
    this.pentaClickMultiplicator = pentaClickMultiplicator;
  }
}

export default Bonus;