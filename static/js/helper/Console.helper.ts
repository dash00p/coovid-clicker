import { config } from "../collection/Config.collection";

const logLevel = config.logLevel || 1;

export const log = (message, grade) => {
  if (grade <= logLevel) {
    console.log(message);
  }
};

export const warn: (message: any) => void = (message): void => {
  console.warn(
    `%c${message}`,
    "color: red; font-family:monospace; font-size: 20px"
  );
};
