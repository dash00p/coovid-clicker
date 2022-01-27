import CoreComponent from "./Core.component";

interface IStatComponenttProps extends ICoreComponentProps {
  img?: {
    src: string
  };
}

class StatComponent extends CoreComponent {
  props: IStatComponenttProps;
  wrapper: any;

  constructor(props: IStatComponenttProps = null) {
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

  getImageSrc(): string {
    return this.props.img && this.props.img.src ? this.props.img.src : null;
  }
}

customElements.define("game-stats", StatComponent);

export default StatComponent;
