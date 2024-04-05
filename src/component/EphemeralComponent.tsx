import { memeList } from "../collection/Memes.collection";
import config from "../logic/Config.logic";
import animStyle from "../css/animation.component.scss";
import Params from "../logic/Params.logic";
import BaseComponent from "./common/BaseComponent";
import ElementRender from "../logic/core/Element.logic";
import Game from "../logic/Game.logic";
import { log } from "../helper/Console.helper";

interface IEphemeralComponentProps extends IBaseComponentProps {
  icon: "goblin" | "pogvid" | "random" | "wow";
  event: memeEventType;
  duration?: number;
  handleClick?: () => void;
}

const styleTemplate: string = `
img {
  max-width: 50px;
  max-height: 50px;
}
`;

class EphemeralComponent extends BaseComponent<IEphemeralComponentProps> {
  declare props: IEphemeralComponentProps;
  declare state: {
    perkAnimationRef: number;
    onBackground: boolean;
  }

  private animationContext: {
    dx: number;
    dy: number;
    duration?: number;
    elapsedTime?: number;
    collisionTime?: number;
    timeStampStart?: number;
    frame?: number;

  };

  constructor(props: IEphemeralComponentProps) {
    super({ ...props, style: styleTemplate });

    this.animationContext = {
      dx: 3,
      dy: 3,
      elapsedTime: 0,
      collisionTime: null,
      timeStampStart: Date.now(),
      frame: 0
    };

    document.body.appendChild(this);
    this.setAnimation();
    if (props.event === memeEventType.perk) {
      if (Params.getInstance().list.soundActive) this.playSound("wow.mp3");
      // Add an observer to the game state to pause the animation when the game is on the background
      this.observe(Game.getInstance().state, 'onBackground', null, this.perkMoveAnimation);
      if (!this.state.onBackground) {
        this.state.perkAnimationRef = this.perkMoveAnimation();
      }
    }

    if (props.event !== memeEventType.perk) {
      this.kill(this.animationContext.duration);
    }

    log("new EphemeralComponent");
  }

  render() {
    return (<div className="ephemeral-content" onclick={() => {
      if (this.props.handleClick) {
        this.props.handleClick();

        if (this.state.perkAnimationRef) {
          cancelAnimationFrame(this.state.perkAnimationRef);
        }

        this.kill();
      }
    }}>
      <img src={this.getSprite(this.props.icon)} />
    </div>);
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

  setAnimation(): void {
    this.className += " ephemeral";

    this.animationContext.duration = this.randomizeDuration();
    if (this.props.event === memeEventType.click) {
      this.style.left = this.randomizePlacement("left").toString();
    } else {
      this.className += " interactive";
      if (this.props.event === memeEventType.perk) {
        this.className += " perk";
        this.style.top = this.randomizePlacement("top").toString();
        const animationStyle = `
        ${animStyle}
        img {
          border:3px solid #fff;
          animation: 2000ms alternate border-rainbow infinite;
          max-width: 85px;
          max-height: 85px;
          border-radius: 5px;
        }`;
        this.setStyle(animationStyle, true);
      }

      this.style.animationDuration = `${this.animationContext.duration.toFixed(2)}ms, 3.5s`;
    }
  }

  perkMoveAnimation(): number {
    const context = this.animationContext;

    const { dx, dy, frame, timeStampStart, duration, elapsedTime } = context;

    // Animation is paused when the game is on the background but ephemeral elements are still created and lifecycle needs to be managed. In this case, frame
    if (frame === 0) {
      this.animationContext.elapsedTime = Date.now() - timeStampStart;

      if (this.state.perkAnimationRef) {
        cancelAnimationFrame(this.state.perkAnimationRef);
      }

      if (this.animationContext.elapsedTime > duration) {
        this.kill();
        return;
      }
      return;
    }

    const logoWidth = this.offsetWidth;
    const logoHeight = this.offsetHeight;
    const { offsetWidth: containerWidth, offsetHeight: containerHeight } = document.body;


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
      this.kill();
      return;
    }

    this.animationContext.frame++;
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;

    this.state.perkAnimationRef = requestAnimationFrame(this.perkMoveAnimation.bind(this));
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
