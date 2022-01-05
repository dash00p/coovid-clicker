import CoreComponent, { ICoreComponentProps } from "./Core.component";

class LayoutComponent extends CoreComponent {
  constructor(props: ICoreComponentProps = null) {
    super(props);
  }
}

customElements.define("game-layout", LayoutComponent);

export default LayoutComponent;
