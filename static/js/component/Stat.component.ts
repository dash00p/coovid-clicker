import CoreComponent from "./Core.component.js";

class StatComponent extends CoreComponent {
  wrapper: any;
  
  constructor(props = null) {
    super(props);

    this.wrapper = this.createChildren("li", "<span></span>");
    this.render(this.wrapper);
  }

  // static get observedAttributes() {
  //   return ['text', 'level'];
  // }

  // get text(){
  //   return this.props.text;
  // }

  rerender() {}

  getImageSrc() {
    return this.props.img && this.props.img.src ? this.props.img.src : null;
  }
}

customElements.define("game-stats", StatComponent);

export default StatComponent;
