import CoreComponent from "./Core.component";

const style: string = `
  #main { width: 60%;}
  #aside { width: 40%;}
`;

class LayoutComponent extends CoreComponent {
  mainContainer: HTMLElement;
  asideContainer: HTMLElement;

  constructor(props: ICoreComponentProps = null) {
    super(props);
    this.mainContainer = CoreComponent.createElement("div", { id: "main" });
    this.asideContainer = CoreComponent.createElement("div", { id: "aside" });
    this.appendChild(this.mainContainer);
    this.appendChild(this.asideContainer);
    this.setStyle(style);
  }

  appendMain(child: IEnhancedHTMLElement) {
    this.mainContainer.appendChild(child);
  }

  appendAside(child: IEnhancedHTMLElement) {
    this.asideContainer.appendChild(child);
  }
}

customElements.define("game-layout", LayoutComponent);

export default LayoutComponent;
