import CoreComponent from "./Core.component";
import { memeList } from "../collection/Memes.collection";
import config from "../logic/Config.logic";
import animStyle from "../../css/animation.component.scss";

interface IEphemeralComponentProps extends ICoreComponentProps {
  icon: "goblin" | "pogvid" | "random" | "wow";
  event: memeEventType;
  duration?: number;
}

const styleTemplate: string = `
    img {
        max-width: 50px;
        max-height: 50px;
    }
`;

class EphemeralComponent extends CoreComponent {
  declare props: IEphemeralComponentProps;

  constructor(props: IEphemeralComponentProps) {
    super(props);

    this.wrapper = this.createChildren(
      "div",
      `<img src="${this.getSprite(props.icon)}" />`
    );
    this.wrapper.className += "ephemeral-content";
    this.render(this.wrapper);
    document.body.appendChild(this);
    this.setStyle();
    if (props.event === memeEventType.perk) {
      this.playSound("wow.mp3");
    }

    this.kill(Number(this.style.animationDuration.slice(0, 5)));
  }

  playSound(file: string): void {
    const audio: HTMLAudioElement = new Audio(`./static/sound/${file}`);
    audio.addEventListener("canplaythrough", (event) => {
      /* the audio is now playable; play it if permissions allow */
      audio.play();
    });
  }

  getSprite(name: string): string {
    let sprite: IMeme;
    if (name === "random") {
      let list: IMeme[] = memeList;
      if (this.props.event) {
        list = list.filter((mem) => mem.event.includes(this.props.event));
      }
      sprite = list[Math.floor(Math.random() * list.length)];
    } else {
      sprite = memeList.find((m) => m.path === name);
    }

    if (sprite) {
      return `./static/img/${sprite.path}.${sprite.extension}`;
    }
  }

  setStyle(): void {
    const style: HTMLStyleElement = document.createElement("style");
    style.textContent = styleTemplate;
    this.shadowRoot.appendChild(style);
    this.addClass("ephemeral");
    if (this.props.event === memeEventType.click) {
      this.style.left = this.randomizePlacement("left").toString();
    } else {
      this.addClass("interactive");
      if (this.props.event === memeEventType.perk) {
        this.addClass("perk");
        this.style.top = this.randomizePlacement("top").toString();
        style.textContent = `
        ${animStyle}
        img {
          border:3px solid #fff;
          animation: 2500ms alternate border-rainbow infinite;
          max-width: 85px;
          max-height: 85px;
          border-radius: 5px;
      }
          @keyframes y-1 {
            to { top:calc(${this.style.top} - 0.5px); }
          }
        `;
      }
    }
    this.style.animationDuration = `${this.randomizeDuration().toFixed(
      2
    )}ms, 3.5s`;
  }

  randomizePlacement(axis: "top" | "left"): number {
    const min: number = axis === "left" ? this.offsetWidth : this.offsetHeight;
    const max: number =
      (axis === "left" ? window.innerWidth : window.innerHeight) - min;
    return Math.floor(Math.random() * (max - min / 2));
  }

  randomizeDuration(): number {
    const duration: number =
      this.props?.duration ?? config.visual.ephemeralTimer;
    const factor: number = 2;
    const ephemeralTimer: number =
      duration +
      (Math.random() * (duration / factor) - duration / (factor * 2));
    return ephemeralTimer;
  }
}

customElements.define("game-ephemeral", EphemeralComponent as any);

export default EphemeralComponent;
