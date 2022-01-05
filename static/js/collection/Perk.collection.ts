export interface IPerk {
    name: string;
    type: perkType;
    value: number;
    duration: number;
    requiredLevel: number;
    id?: number;
}


export enum perkType {
    clickMultiplicator = "clickMultiplicator",
    clickAddFixedValue = "clickAddFixedValue",
    clickAddRelativeValue = "clickAddRelativeValue",
}

export const perkList: IPerk[] = [
    {
        name: "Double click",
        type: perkType.clickMultiplicator,
        value: 2,
        requiredLevel: 1,
        duration: 15000
    },
    {
        name: "+10 click",
        type: perkType.clickAddFixedValue,
        value: 10,
        requiredLevel: 1,
        duration: 30000
    },
];