import { realSetInterval } from "../../helper/Guard.helper";
import commonStyle from "./common.component.scss";

class CoreComponent extends HTMLElement {
  props: ICoreComponentProps;
  wrapper: HTMLElement;
  state: ICoreComponentsState;
  component: any;
  shadowRoot: ShadowRoot;
  _activeJobs: number[];

  constructor(props: ICoreComponentProps) {
    super();

    this.state = {
      rendered: false,
    };
    this.props = props || {};
    this.shadowRoot = this.attachShadow({ mode: "open" });
    this.setDefaultStyle(commonStyle);
    this._activeJobs = [];
    if (props && props.children) {
      this.appendChild(props.children);
    }

    if (props && props.handleClick) {
      const that: this = this;
      this.onclick = function (
        this: GlobalEventHandlers,
        ev: MouseEvent,
        args?: any
      ): any {
        props.handleClick.call(props.context ?? this, ev);
        if (props.killOnClick) {
          that.kill(0);
        }
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

  /** TODO: Refactor & document this method. initialValue should be a ref to avoid a copy inside the component. */
  listen(
    ref: CoreComponent,
    name: string,
    initialValue: string | number | object,
    callbackList: Function[]
  ): void {
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
    parent.state[name] = initialValue;
  }

  clearContent(node: Element): void {
    node.innerHTML = ``;
  }

  updateContent(
    node: Element,
    html: string,
    elementsToAppend?: IEnhancedHTMLElement[]
  ): void {
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

  createChildren(
    type: string,
    content: string = "",
    subChildren: IEnhancedHTMLElement = null
  ): HTMLElement {
    const el: HTMLElement = document.createElement(type);
    el.innerHTML = content;
    if (subChildren) {
      subChildren.component = this;
      el.appendChild(subChildren);
    }
    return el;
  }

  addElements(container: HTMLElement, ...elements: HTMLElement[]) {
    for (const el of elements) {
      this.appendChild(el, container);
    }
  }

  static createElement(type: string, options?: ICreateElementOptions | string) {
    const el: HTMLElement = document.createElement(type);

    if (typeof options === 'string') {
      options = { content: options };
    }

    if (options) {
      if (options.className) el.className = options.className;
      if (options.id) el.id = options.id;
      if (options.handleClick) el.onclick = options.handleClick;
      if (options.content) el.innerHTML = options.content;
    }
    return el;
  }

  create(
    type: string,
    content?: string,
    customType: string = null
  ): HTMLElement {
    const el: HTMLElement = document.createElement(type, { is: customType });
    el.innerHTML = content || null;
    this.shadowRoot.appendChild(el);
    this.state.rendered = true;
    return el;
  }

  setHTML<T extends HTMLElement>(text: string, parent?: T): void {
    if (parent) {
      parent.innerHTML = text;
    } else {
      this.shadowRoot.innerHTML = text;
    }
  }

  appendChild<
    T extends IEnhancedHTMLElement | IEnhancedNode,
    P extends ParentNode
  >(element: T, parent?: P, attachComponent?: boolean): T {
    if (attachComponent) element.component = this;
    if (parent) {
      return parent.appendChild(element);
    } else {
      return this.shadowRoot.appendChild(element);
    }
  }

  prependChild<N extends Node | string, T extends ParentNode>(
    element: N,
    parent?: T
  ): HTMLElement {
    if (parent) {
      parent.prepend(element);
    } else {
      this.shadowRoot.prepend(element);
    }
    return element as HTMLElement;
  }

  removeAllChild(parentNode?: ParentNode): void {
    const el = parentNode || this;
    while (el.lastChild) {
      if (typeof (el.lastChild as CoreComponent).clearActiveJobs === "function") {
        (el.lastChild as CoreComponent).clearActiveJobs();
      }
      el.removeChild(el.lastChild);
    }
  }

  find(query: string): HTMLElement {
    return this.shadowRoot.querySelector(query);
  }

  findById(query: string): Node {
    return this.shadowRoot.getElementById(query);
  }

  kill(delay: number = 0): void {
    setTimeout(() => {
      this.remove();
      this.clearActiveJobs();
    }, delay);
  }

  clearActiveJobs() {
    for (const job of this._activeJobs) {
      clearInterval(job);
      const jobIndex = this._activeJobs.indexOf(job);
      if (jobIndex > -1) {
        this._activeJobs.splice(jobIndex, 1);
      }
    }
  }

  // internal method to use the default style
  private setDefaultStyle(styleContent: string): void {
    const style: HTMLStyleElement = document.createElement("style");
    style.textContent = styleContent;
    this.shadowRoot.prepend(style);
  }

  setStyle(styleContent: string): void {
    const style: HTMLStyleElement = document.createElement("style");
    style.textContent = styleContent;
    this.shadowRoot.prepend(style);
  }

  setInterval(
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): ReturnType<typeof setInterval> {
    const interval = realSetInterval(handler, timeout, ...args);
    this._activeJobs.push(interval);
    return interval;
  }
}

export default CoreComponent;
