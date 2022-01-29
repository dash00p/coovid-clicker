declare module "*.scss";

declare class CoreComponent {
  props: ICoreComponentProps;
  wrapper: HTMLElement;
  state: ICoreComponentsState;
  component: any;
  shadowRoot: ShadowRoot;
}

declare interface ICoreComponentProps {
  children?: Node;
  handleClick?:
    | ((this: GlobalEventHandlers, ev: MouseEvent, args?: any) => any)
    | null;
  context?: any;
  killOnClick?: boolean;
}

declare interface ICoreComponentsState {
  rendered: boolean;
}

declare interface IEnhancedHTMLElement extends HTMLElement {
  component?: CoreComponent;
  props?: any;
}

declare interface IEnhancedNode extends Node {
  component?: CoreComponent;
  props?: any;
}

declare interface ICreateElementOptions {
  className?: string;
  content?: string;
  id?: string;
  handleClick?:
    | ((this: GlobalEventHandlers, ev: MouseEvent, args?: any) => any)
    | null;
}
