export interface IPerk {
    name: string;
    type: perkType;
    value: number;
    duration: number;
    requiredLevel: number;
    id?: number;
    isActive?: boolean;
}


export enum perkType {
    clickMultiplicator = "clickMultiplicator",
    clickAddFixedValue = "clickAddFixedValue",
    clickAddRelativeValue = "clickAddRelativeValue",
    clickAuto = "clickAuto",
    productionMultiplicator = "productionMultiplicator"
}

export const perkList: IPerk[] = [
    {
        name: "Pentaclick",
        type: perkType.clickMultiplicator,
        value: 5,
        requiredLevel: 1,
        duration: 15000
    },
    {
        name: "+10 click",
        type: perkType.clickAddFixedValue,
        value: 10,
        requiredLevel: 1,
        duration: 20000
    },
    {
        name: "Auto click (15/s)",
        type: perkType.clickAuto,
        isActive: true,
        value: 15,
        requiredLevel: 1,
        duration: 30000
    },
    {
        name: "Double-production",
        type: perkType.productionMultiplicator,
        value: 2,
        requiredLevel: 1,
        duration: 30000
    },
];