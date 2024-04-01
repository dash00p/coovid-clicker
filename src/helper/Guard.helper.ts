import { warn } from "./Console.helper";

export const realSetInterval: (
  handler: TimerHandler,
  timeout?: number,
  ...args: any[]
) => ReturnType<typeof setInterval> = window.setInterval;
const lockInterval: boolean = true;

export const initGuard: () => void = (): void => {
  window.setInterval = (
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): ReturnType<typeof setInterval> => {
    if (!lockInterval) {
      let intervalId: ReturnType<typeof setInterval> = realSetInterval(
        handler,
        timeout,
        ...args
      );
      return intervalId;
    } else {
      warn("I know what you did.");
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    }
  };
};

export const killGuard: () => void = () => {
  window.setInterval = realSetInterval;
};

export default {
  initGuard,
  killGuard,
};
