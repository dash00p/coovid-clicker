import CoreComponent from "./Core.component.js";

class LayoutComponent extends CoreComponent {
  wrapper: any;
  constructor(props = null) {
    super(props);
    this.wrapper = this.createChildren("div", "");
    this.render(this.wrapper);
  }
}

customElements.define("game-layout", LayoutComponent);

export default LayoutComponent;
