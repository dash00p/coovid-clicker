import config from "../collection/Config.collection.json";

const logLevel = config.game.logLevel || 1;

export const log = (message, grade) => {
  if (grade <= logLevel) {
    console.log(message);
  }
};

export const logWithTimer = (message, grade) => {
  if (grade <= logLevel) {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
  }
};

export const warn: (message: any) => void = (message): void => {
  console.warn(
    `%c${message}`,
    "color: red; font-family:monospace; font-size: 20px"
  );
};
