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
export const commarize: (number: number, depth?: number) => string = (
  number: number,
  depth: number = 4
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

  if (number > 1e6) {
    const exp: string = number.toExponential().split("e+")[1];
    let unit: number = Math.floor((Number(exp) - 3) / 3) * 3;
    const pow: any = "1e" + (unit + 3);
    // calculate the remainder
    let num: number = number / (pow as number);
    const unitName: string = units[Math.floor(unit / 3) - 1];
    return `${num.toFixed(num % 1 !== 0 ? depth : 0)} ${unitName}${
      num >= 2 ? "s" : ""
    }`;
  }
  let num;
  if (number > 1e3) {
    num = Math.round((number * 10) / 10);
  } else num = number;
  return num.toLocaleString();
};
