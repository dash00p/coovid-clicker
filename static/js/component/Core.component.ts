class CoreComponent extends HTMLElement {
  props: any;
  wrapper: HTMLElement;
  state: { rendered: boolean; };
  component: any;
  shadowRoot: ShadowRoot;
  
  constructor(props) {
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

  render(element, callback = null) {
    this.shadowRoot.appendChild(element);
    this.state.rendered = true;
    if (callback) callback();
  }

  setClass(className) {
    this.className = className;
  }

  listen(ref, name, val) {
    //this.state.listeners[ref] = get ref()
    const parent = ref;
    Object.defineProperty(this.state, name, {
      get() {
        return parent.state[`_${name}`];
      },
      set(value) {
        parent.state[`_${name}`] = value;
        if (parent.state.rendered && parent.rerender) parent.rerender();
      },
    });
    parent.state[name] = val;
  }

  updateContent(node, html) {
    node.childNodes[0].innerHTML = html;
  }

  updateText(node, html) {
    node.childNodes[0].textContent = html;
  }

  createChildren(type, content = "", subChildren = null) {
    const el:HTMLElement = document.createElement(type);
    el.innerHTML = content;
    if (subChildren){
      subChildren.component = this;
      el.appendChild(subChildren);
    }
    return el;
  }

  create(type, content, customType = null) {
    const el = document.createElement(type, { is:customType});
    el.innerHTML = content;
    this.shadowRoot.appendChild(el);

  }

  appendChild<T extends Node>(element: T): T {
    return this.shadowRoot.appendChild(element);
  }
}

export default CoreComponent;