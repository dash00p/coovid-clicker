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
