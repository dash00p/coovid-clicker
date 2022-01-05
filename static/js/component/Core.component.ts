import { IEnhancedHTMLElement } from "../type/html";

export interface ICoreComponentProps {
  children?: Node;
}

class CoreComponent extends HTMLElement {
  props: ICoreComponentProps;
  wrapper: HTMLElement;
  state: { rendered: boolean; };
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
  }

  render(element: Node, callback: Function = null): void {
    this.shadowRoot.appendChild(element);
    this.state.rendered = true;
    if (callback) { callback.call(this); }
  }

  setClass(className: string): void {
    this.className = className;
  }

  listen(ref: CoreComponent, name: string, val: string | number, callback: Function): void {
    const parent: CoreComponent = ref;
    Object.defineProperty(this.state, name, {
      get(): any {
        return parent.state[`_${name}`];
      },
      set(value: string | number): void {
        parent.state[`_${name}`] = value;
        if (parent.state.rendered && callback) { callback.call(ref); }
      },
    });
    parent.state[name] = val;
  }

  updateContent(node: HTMLElement, html: string): void {
    node.children[0].innerHTML = html;
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

  setHTML(text: string): void {
    this.shadowRoot.innerHTML = text;
  }

  appendChild<T extends Node>(element: T): T {
    return this.shadowRoot.appendChild(element);
  }

  find(query: string): Node {
    return this.shadowRoot.querySelector(query);
  }

  findById(query: string): Node {
    return this.shadowRoot.getElementById(query);
  }
}

export default CoreComponent;
