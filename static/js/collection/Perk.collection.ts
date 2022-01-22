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
        name: "Auto click",
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