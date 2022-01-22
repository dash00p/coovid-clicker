declare const enum perkType {
    clickMultiplicator = "clickMultiplicator",
    clickAddFixedValue = "clickAddFixedValue",
    clickAddRelativeValue = "clickAddRelativeValue",
    clickAuto = "clickAuto",
    productionMultiplicator = "productionMultiplicator",
    fortuneGift = "powerClick"
}

declare interface IPerk {
    name: string;
    type: perkType;
    value?: number;
    duration: number;
    requiredLevel: number;
    id?: number;
    isActive: boolean;
    isApplied?: boolean;
    order?: number;
}