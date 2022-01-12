export interface IPerk {
    name: string;
    type: perkType;
    value?: number;
    duration: number;
    requiredLevel: number;
    id?: number;
    isActive: boolean;
    order?: number;
}


export enum perkType {
    clickMultiplicator = "clickMultiplicator",
    clickAddFixedValue = "clickAddFixedValue",
    clickAddRelativeValue = "clickAddRelativeValue",
    clickAuto = "clickAuto",
    productionMultiplicator = "productionMultiplicator",
    fortuneGift = "powerClick"
}

export const perkList: IPerk[] = [
    {
        duration: 45000,
        isActive: true,
        name: "Pentaclick",
        requiredLevel: 1,
        type: perkType.clickMultiplicator,
        value: 5,
    },
    {
        duration: 45000,
        isActive: true,
        name: "Production click",
        requiredLevel: 1,
        type: perkType.clickAddFixedValue,
    },
    {
        duration: 30000,
        isActive: false,
        name: "Auto click (15/s)",
        requiredLevel: 1,
        type: perkType.clickAuto,
        value: 15,
    },
    {
        duration: 30000,
        isActive: false,
        name: "Double-production",
        order: 1,
        requiredLevel: 1,
        type: perkType.productionMultiplicator,
        value: 2,
    },
    {
        duration: 10000,
        isActive: false,
        name: "Fortune gift",
        order: 3,
        requiredLevel: 1,
        type: perkType.fortuneGift,
    }
];