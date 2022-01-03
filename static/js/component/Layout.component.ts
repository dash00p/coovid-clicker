import CoreComponent from "./Core.component";

class LayoutComponent extends CoreComponent {
  constructor(props = null) {
    super(props);
    this.wrapper = this.createChildren("div");
    this.render(this.wrapper);
  }
}

customElements.define("game-layout", LayoutComponent);

export default LayoutComponent;
