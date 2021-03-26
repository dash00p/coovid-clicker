import CoreComponent from "./Core.component";
import { memeList } from "../collection/Memes.collection";

interface IProps {
  delay: number;
  icon: "goblin" | "pogvid" | "random";
}

const styleTemplate: string = `
    img {
        max-width: 50px;
        max-height: 50px;
    }
`;

class EphemeralComponent extends CoreComponent {
  wrapper: any;

  constructor(props: IProps) {
    super(props);

    this.wrapper = this.createChildren(
      "div",
      `<img src="${this.getSprite(props.icon)}" />`
    );
    this.wrapper.className += "ephemeral-content";
    this.render(this.wrapper);
    document.body.appendChild(this);
    this.setStyle();

    if (props.delay) {
      this.kill();
    }
  }

  getSprite(name: string): string {
    let sprite: any = name;
    if (name === "random") {
      sprite = memeList[Math.floor(Math.random() * memeList.length)];
      return `./static/img/${sprite.path}.${sprite.extension}`;
    }
    return `./static/img/${sprite}.png`;
  }

  setStyle(): void {
    const style: HTMLStyleElement = document.createElement("style");
    style.textContent = styleTemplate;
    this.shadowRoot.appendChild(style);
    this.setClass("ephemeral");
    const min: number = this.offsetWidth;
    const max: number = window.innerWidth - min;
    const left: number = Math.floor(Math.random() * (max - min / 2));
    this.style.left = left.toString();
  }

  kill(): void {
    setTimeout(() => {
      this.parentNode.removeChild(this);
    }, this.props.delay);
  }
}

customElements.define("game-ephemeral", EphemeralComponent as any);

export default EphemeralComponent;
