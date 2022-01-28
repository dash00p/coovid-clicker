import { oldInterval } from "../helper/Guard.helper";

class CoreComponent extends HTMLElement {
  props: ICoreComponentProps;
  wrapper: HTMLElement;
  state: ICoreComponentsState;
  component: any;
  shadowRoot: ShadowRoot;

  constructor(props: ICoreComponentProps) {
    super();

    this.state = {
      rendered: false,
    };
    this.props = props || {};
    this.attachShadow({ mode: "open" });
    if (props && props.children) {
      this.appendChild(props.children);
    }

    if (props && props.handleClick) {
      const that: this = this;
      this.onclick = function (this: GlobalEventHandlers, ev: MouseEvent, args?: any): any {
        props.handleClick.call(props.context ?? this, ev);
        if (props.killOnClick) { that.kill(0); }
      };
    }
  }

  render(element: Node, callbackList?: Function[]): void {
    this.shadowRoot.appendChild(element);
    this.state.rendered = true;
    if (callbackList) {
      for (const callback of callbackList) {
        callback.call(this);
      }
    }
  }

  addClass(className: string): void {
    this.className += className + " ";
  }

  listen(ref: CoreComponent, name: string, val: string | number | object, callbackList: Function[]): void {
    const parent: CoreComponent = ref;
    Object.defineProperty(this.state, name, {
      get(): any {
        return parent.state[`_${name}`];
      },
      set(value: string | number): void {
        parent.state[`_${name}`] = value;
        if (parent.state.rendered && callbackList) {
          for (const callback of callbackList) {
            callback.call(ref);
          }
        }
      },
    });
    parent.state[name] = val;
  }

  clearContent(node: Element): void {
    node.innerHTML = ``;
  }

  updateContent(node: Element, html: string, elementsToAppend?: IEnhancedHTMLElement[]): void {
    node.innerHTML = html;
    if (elementsToAppend && elementsToAppend.length) {
      for (const element of elementsToAppend) {
        node.append(element);
      }
    }
  }

  updateText(node: HTMLElement, html: string): void {
    node.childNodes[0].textContent = html;
  }

  createChildren(type: string, content: string = "", subChildren: IEnhancedHTMLElement = null): HTMLElement {
    const el: HTMLElement = document.createElement(type);
    el.innerHTML = content;
    if (subChildren) {
      subChildren.component = this;
      el.appendChild(subChildren);
    }
    return el;
  }

  create(type: string, content: string, customType: string = null): void {
    const el: HTMLElement = document.createElement(type, { is: customType });
    el.innerHTML = content;
    this.shadowRoot.appendChild(el);
  }

  setHTML<T extends HTMLElement>(text: string, parent?: T): void {
    if (parent) {
      parent.innerHTML = text;
    } else { this.shadowRoot.innerHTML = text; }
  }

  appendChild<T extends Node>(element: T, parent?: T): T {
    if (parent) {
      return parent.appendChild(element);
    } else { return this.shadowRoot.appendChild(element); }
  }

  find(query: string): HTMLElement {
    return this.shadowRoot.querySelector(query);
  }

  findById(query: string): Node {
    return this.shadowRoot.getElementById(query);
  }

  kill(lifetime: number): void {
    setTimeout(() => {
      this.remove();
    }, lifetime);
  }

  setStyle(styleContent: string): void {
    const style: HTMLStyleElement = document.createElement("style");
    style.textContent = styleContent;
    this.shadowRoot.appendChild(style);
  }

  setInterval(
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): ReturnType<typeof setInterval> {
    return oldInterval(handler, timeout, ...args);
  }
}

export default CoreComponent;
