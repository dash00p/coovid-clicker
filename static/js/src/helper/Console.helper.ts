import { config } from "../collection/Config.collection.js";

const logLevel = config.logLevel || 1;

export const log = (message, grade) => {
  if (grade <= logLevel) {
    console.log(message);
  }
};
