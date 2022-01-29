import CoreComponent from "./Core.component";

interface IStatComponenttProps extends ICoreComponentProps {
  img?: {
    src: string;
  };
}

class StatComponent extends CoreComponent {
  declare props: IStatComponenttProps;

  constructor(props: IStatComponenttProps = null) {
    super(props);

    this.wrapper = this.createChildren("li", "<span></span>");
    this.render(this.wrapper);
  }

  getImageSrc(): string {
    return this.props.img && this.props.img.src ? this.props.img.src : null;
  }
}

customElements.define("game-stats", StatComponent);

export default StatComponent;
