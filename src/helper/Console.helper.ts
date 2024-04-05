import config from "../logic/Config.logic";

const logLevel: number = config.game.logLevel || 1;

/** Logs a message to the console only if the grade is less than or equal to the log level. 
 * The log level in `prod` should always be lower than in `dev`.
*/
export const log: (message: string, grade?: number) => void = (
  message,
  grade = 3
) => {
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
