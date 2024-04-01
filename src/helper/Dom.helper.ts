export const findChildrenbyId: (parent: any, childrenId: any) => any = (
  parent,
  childrenId
) => {
  let child: Node;
  for (let i: number = 0; i < parent.childNodes.length; i++) {
    if (
      parent.childNodes[i].props &&
      parent.childNodes[i].props.id === childrenId
    ) {
      child = parent.childNodes[i];
      break;
    }
  }
  return child;
};

// https://gist.github.com/MartinMuzatko/1060fe584d17c7b9ca6e
export const commarize: (input: number, depth?: number, displayDecimal?: boolean) => string = (
  input: number,
  depth: number = 4,
  displayDecimal: boolean = false
): string => {
  const units: string[] = [
    "Million",
    "Milliard",
    "Billion",
    "Billiard",
    "Trillion",
    "Trilliard",
    "Quadrillion",
    "Quadrilliard",
    "Quintillion",
    "Quintilliard",
    "Sextillion",
    "Sextilliard",
    "Septillion",
    "Septilliard",
  ];

  if (input > 1e6) {
    const exp: string = input.toExponential().split("e+")[1];
    let unit: number = Math.floor((Number(exp) - 3) / 3) * 3;
    const pow: any = "1e" + (unit + 3);
    // calculate the remainder
    let num: number = input / (pow as number);
    let unitName: string = `${units[Math.floor(unit / 3) - 1] || "Nani ?!"}`;

    // add the s if the number is greater than 1 and the unit is not the last
    if (num >= 2 && unit < units.length * 3) unitName += "s";

    return `${num.toFixed(num % 1 !== 0 ? depth : 0)} ${unitName}`;
  }
  let number: number;
  if (input > 1e3) {
    number = Math.round((input * 10) / 10);
  } else number = displayDecimal ? input : Math.round((input * 10) / 10);
  return number.toLocaleString();
};

export const addObserver = (obj: any, property: string, callback: () => void): void => {
  let objectToObserve: any;
  let propertyToObserve: string = property;

  // if property is an object, observe the object itself because proxy won't catch changes in nested properties.
  if (typeof obj[property] === "object") {
    objectToObserve = obj[property];
    propertyToObserve = "self";
  } else {
    objectToObserve = obj;
  }

  if (!objectToObserve._observers[propertyToObserve]) {
    objectToObserve._observers[propertyToObserve] = new Set();
  }
  objectToObserve._observers[propertyToObserve].add(callback);
}
