import { bonusList } from "../collection/Bonus.collection";
import { warn } from "../helper/Console.helper";
import Game from "./Game.logic";
import Building from "./Building.logic";
import Core from "./core/Core.logic";
import Clicker from "./Clicker.logic";

/**
 * Represents a bonus that can be purchased by the player.
 * 
 * Contrary to perks, bonus are permanent, purchasable and applied once.
 */
class Bonus extends Core<Bonus> {
  state: {
    availableBonus: IBonus[];
    productionMultiplicator: number;
    buildingPurchaseDivisor: number;
  };

  perkRoutineTimerReducer: number;
  perkEffectTimerMultiplicator: number;
  autoClickMultiplicator: number;
  buildingCountTrigger: number;
  pentaClickMultiplicator: number;

  constructor() {
    super();
    this.perkRoutineTimerReducer =
      this.perkEffectTimerMultiplicator =
      this.autoClickMultiplicator =
      this.pentaClickMultiplicator =
      //this.buildingPurchaseDivisor =
      1;

    this.state = this.setProxy({
      availableBonus: [],
      productionMultiplicator: 1,
      buildingPurchaseDivisor: 1,
    });
  }

  get availableBonus(): IBonus[] {
    return this.state.availableBonus;
  }

  checkAvailableBonus(): void {
    const availableBonusList: number[] = this.state.availableBonus.map((b) => b.id);
    const newBonuses = bonusList.filter(
      (b) =>
        !availableBonusList.includes(b.id) &&
        b.neededProduction <= Building.getInstance().totalProduction
    );
    for (const bonus of newBonuses) {
      this.state.availableBonus.push(structuredClone(bonus));
    }
  }

  loadBonusFromSave(savedBonuses: IBaseBonus[]): void {
    for (const baseBonus of savedBonuses) {
      const bonus = bonusList.find((b) => b.id === baseBonus.id);
      if (bonus) {
        this.state.availableBonus.push({
          isPurchased: true,
          ...bonus,
        });
      }
    }
    this.applyBonus();
    Clicker.getInstance().refreshIncrementFromBuildings(
      Building.getInstance().getTotalProduction()
    );
    this.checkAvailableBonus();
  }

  saveBonuses(): IBaseBonus[] {
    return this.state.availableBonus
      .filter((b) => b.isPurchased)
      .map((b) => {
        return {
          id: b.id,
        };
      });
  }

  addBonus(bonusId: number): IBonus {
    const bonusIndex = this.state.availableBonus.findIndex((b) => b.id === bonusId);
    if (bonusIndex === -1) {
      warn("Invalid attempt to apply a bonus");
      return;
    }

    let newBonus = this.state.availableBonus[bonusIndex];

    if (newBonus.cost > Game.getInstance().getAmount()) {
      warn("Bonus not affordable");
      return;
    }

    if (newBonus.isPurchased) {
      warn("Bonus already unlocked");
      return;
    }

    newBonus.isPurchased = true;
    Game.getInstance().incrementAmount(-newBonus.cost);
    this.applyBonus();
    return newBonus;
  }

  /**
   * Apply every bonus purchased by the player.
   */
  applyBonus() {
    let productionMultiplicator = 1,
      perkTimerReducer = 1,
      perkEffectMultiplicator = 1,
      autoClickMultiplicator = 1,
      pentaClickMultiplicator = 1,
      buildingPurchaseDivisor = 1;
    for (const bonus of this.state.availableBonus.filter((b) => b.isPurchased)) {
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
        case bonusType.buildingPurchaseDivisor:
          buildingPurchaseDivisor *= bonus.value;
          break;
      }
    }
    this.state.productionMultiplicator = productionMultiplicator;
    this.state.buildingPurchaseDivisor = buildingPurchaseDivisor;
    this.perkRoutineTimerReducer = perkTimerReducer;
    this.perkEffectTimerMultiplicator = perkEffectMultiplicator;
    this.autoClickMultiplicator = autoClickMultiplicator;
    this.pentaClickMultiplicator = pentaClickMultiplicator;
  }
}

export default Bonus;