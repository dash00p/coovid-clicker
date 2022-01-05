import { warn } from "./Console.helper";

const oldInterval:(handler: TimerHandler, timeout?: number, ...args: any[]) => ReturnType<typeof setInterval> = window.setInterval;
const lockInterval:boolean = true;

export const bootstrap: () => void = (): void => {
  window.setInterval = (
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): ReturnType<typeof setInterval> => {
    if (!lockInterval) {
      let intervalId: ReturnType<typeof setInterval> = oldInterval(handler, timeout, ...args);
      return intervalId;
    } else {
      warn("I know what you did.");
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    }
  };
};

export default bootstrap;