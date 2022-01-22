declare const IS_DEV: boolean;

declare const enum memeEventType {
  click = "click",
  perk = "perk",
}

declare interface IMeme {
    path: string;
    extension: "png" | "gif";
    event?: memeEventType[];
  }