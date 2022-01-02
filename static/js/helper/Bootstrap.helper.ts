import { warn } from "./Console.helper";

const oldInterval = window.setInterval;
const lockInterval = true;

export const bootstrap: () => void = (): void => {
  window.setInterval = (
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): number => {
    if (!lockInterval) {
      let intervalId: number = oldInterval(handler, timeout, ...args);
      return intervalId;
    } else {
      warn("I know what you did.");
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    }
  };
};

export default bootstrap;
/*
Type '
(handler: TimerHandler, timeout?: number, ...args: any[]) => number' is not assignable to type '
((handler: TimerHandler, timeout?: number, ...arguments: any[]) => number) & { (handler: TimerHandler, timeout?: number, ...arguments: any[]): number; (callback: (...args: any[]) => void, ms?: number, ...args: any[]): Timeout; }'.
  Type '(handler: TimerHandler, timeout?: number, ...args: any[]) => number' is not assignable to type '{ (handler: TimerHandler, timeout?: number, ...arguments: any[]): number; (callback: (...args: any[]) => void, ms?: number, ...args: any[]): Timeout; }'.
    Type 'number' is not assignable to type 'Timeout'.ts(2322)
    */
