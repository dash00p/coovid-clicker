declare const IS_DEV: boolean;

// Meme definitions

declare const enum memeEventType {
  click = "click",
  perk = "perk",
}

declare interface IMeme {
  path: string;
  extension: "png" | "gif";
  event?: memeEventType[];
}

// Building definitions

declare const enum buildingType {
  chercheur = 1,
  raoult,
  christ,
  monkey,
  richard,
  lorenzo,
  thamos,
  patoche,
  sardoche,
  jeanMichel,
  leeroy,
  canardMan,
  jeanne,
  miyagi,
  bruce,
  petyr,
  heenok,
  mother,
  katlyn,
  bebou,
}

declare interface IBaseBuilding {
  id: buildingType;
  level?: number;
  activeUpgrades?: IBuildingUpgrade[];
}

declare interface IBuildingUpgrade {
  id: number;
  buildingId?: number;
  cost?: number;
  description?: string;
  multiplicator?: number;
  name?: string;
  requestedLevel?: number;
}

declare interface IAvalailableBuilding extends IBuilding {
  available?: boolean;
}

declare interface IBuilding extends IBaseBuilding {
  amountMultiplier: number;
  baseAmount: number;
  baseProduction: number;
  currentAmount?: number;
  currentProduction?: number;
  description?: string;
  img?: {
    src: string;
  };
  name: string;
  neededProduction?: number;
}


// Perf definitions

declare const enum perkType {
  clickMultiplicator = "clickMultiplicator",
  clickAddFixedValue = "clickAddFixedValue",
  clickAddRelativeValue = "clickAddRelativeValue",
  clickAuto = "clickAuto",
  productionMultiplicator = "productionMultiplicator",
  fortuneGift = "powerClick",
}

declare interface IPerk {
  name: string;
  type: perkType;
  value?: number;
  /** duration in millisecond */
  duration: number;
  requiredLevel: number;
  id?: number;
  isActive: boolean;
  isApplied?: boolean;
  order?: number;
}

// Bonus definitions
declare interface IBaseBonus {
  id: number;
}
declare interface IBonus extends IBaseBonus {
  cost: number;
  isPurchased?: boolean;
  name: string;
  neededProduction: number;
  type: bonusType;
  value: number;
  value2?: number;
}

declare const enum bonusType {
  productionMultiplicator = "productionMultiplicator",
  perkTimerReducer = "perkTimerReducer",
  perkEffectMultiplicator = "perkEffectMultiplicator",
  autoClickMultiplicator = "autoClickMultiplicator",
  buildingCountMultiplicator = "buildingCountMultiplicator",
  perkClickMultiplicator = "perkClickMultiplicator",
  perkProductionMultiplicator = "productionPerkMultiplicator",
}

declare interface IBonusComponentProps extends IBonus, ICoreComponentProps { }

// Stats definitions
declare interface IStat {
  buildingCount: number;
  clickCount: number;
  perkCount: number;
  totalEarnings: number;
}

// Params definitions
declare interface IParams {
  soundActive: boolean;
}