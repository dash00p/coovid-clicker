import CoreComponent from "./common/Core.component";
import { memeList } from "../collection/Memes.collection";
import config from "../logic/Config.logic";
import animStyle from "../../css/animation.component.scss";
import Params from "../logic/Params.logic";

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
  private animationContext: {
    dx: number;
    dy: number;
    duration?: number;
    elapsedTime?: number;
    collisionTime?: number;
    timeStampStart?: number;
    frame?: number;

  } = { dx: 3, dy: 3, elapsedTime: 0, collisionTime: null, timeStampStart: Date.now(), frame: 0 };

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
      if (Params.getInstance().list.soundActive) this.playSound("wow.mp3");
      this.perkMoveAnimation();
    }

    if (props.event !== memeEventType.perk) {
      this.kill(this.animationContext.duration);
    }
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

    this.animationContext.duration = this.randomizeDuration();
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
          animation: 2000ms alternate border-rainbow infinite;
          max-width: 85px;
          max-height: 85px;
          border-radius: 5px;
        }`;
      }

      this.style.animationDuration = `${this.animationContext.duration.toFixed(2)}ms, 3.5s`;
    }
  }

  perkMoveAnimation(): void {
    const logoWidth = this.offsetWidth;
    const logoHeight = this.offsetHeight;
    const { offsetWidth: containerWidth, offsetHeight: containerHeight } = document.body;

    const context = this.animationContext;
    const { dx, dy, frame, timeStampStart, duration, elapsedTime } = context;

    let x = parseInt(this.style.left || "0");
    let y = parseInt(this.style.top || "0");

    // Update the position
    x += dx;
    y += dy;

    let hasCollided = false;

    // Collision detection
    if (!context.collisionTime) {
      if (x < 0 || x + logoWidth > containerWidth) {
        hasCollided = true;
        this.animationContext.dx = -dx; // Reverse the horizontal direction
      }
      if (y < 0 || y + logoHeight > containerHeight) {
        hasCollided = true;
        this.animationContext.dy = -dy; // Reverse the vertical direction
      }
    }

    // Update the context every 50 frames to avoid performance issues
    if (frame % 50) {
      this.animationContext.elapsedTime = Date.now() - timeStampStart;

      if (hasCollided
        && !context.collisionTime
        && this.animationContext.elapsedTime > duration
      )
        this.animationContext.collisionTime = Date.now() - timeStampStart
    }

    const { collisionTime } = this.animationContext;

    // Kill the element 8 seconds after the collision to ensure it's off the screen
    if (collisionTime !== null && elapsedTime > collisionTime + 8000) {
      return this.kill();
    }

    this.animationContext.frame++;
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
    requestAnimationFrame(this.perkMoveAnimation.bind(this));
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
