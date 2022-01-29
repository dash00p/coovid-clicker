import { oldInterval } from "../helper/Guard.helper";

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

  listen(
    ref: CoreComponent,
    name: string,
    val: string | number | object,
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
    parent.state[name] = val;
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

  static createElement(type: string, options?: ICreateElementOptions) {
    const el: HTMLElement = document.createElement(type);

    if (options) {
      if (options.className) el.className = options.className;
      if (options.id) el.id = options.id;
      if (options.handleClick) el.onclick = options.handleClick;
      if (options.content) el.innerHTML = options.content;
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

  prependChild<T extends ParentNode, N extends Node>(
    element: N,
    parent?: T
  ): void {
    if (parent) {
      return parent.prepend(element);
    } else {
      return this.shadowRoot.prepend(element);
    }
  }

  removeAllChild(parentNode?: ParentNode): void {
    const el = parentNode ? parentNode : this;
    while (el.lastChild) {
      if ((el.lastChild as CoreComponent).clearActiveJobs) {
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

  kill(lifetime: number): void {
    setTimeout(() => {
      this.remove();
      this.clearActiveJobs();
    }, lifetime);
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
    const interval = oldInterval(handler, timeout, ...args);
    this._activeJobs.push(interval);
    return interval;
  }
}

export default CoreComponent;
