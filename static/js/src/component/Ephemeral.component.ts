import CoreComponent from "./Core.component.js";

interface IProps{
    delay: number | undefined;
    icon: 'goblin' | 'pogvid' | 'random';
  }
  
const styleTemplate = `  
    img {
        max-width: 50px;
        max-height: 50px;
    }
`;

class EphemeralComponent extends CoreComponent{
    wrapper: any;
    private static icons = ['goblin','pogvid','notLikeThis','notStonks','stonks','pauseChamp','peepoEh','sadcat','sanic','spongebobMock','thinkingBlackGuy'];

    constructor(props: IProps){
        super(props);

        this.wrapper = this.createChildren("div",`<img src="${this.getSprite(props.icon)}" />`);
        this.wrapper.className += "ephemeral-content"
        this.render(this.wrapper);
        this.setStyle();
        document.body.appendChild(this);

        if(props.delay){
            this.kill();
        }
    }

    getSprite(name){
        let sprite = name;
        if(name === "random"){
            sprite = EphemeralComponent.icons[Math.floor(Math.random() * EphemeralComponent.icons.length)]
        }

        return `./static/img/${sprite}.png`;
    }

    setStyle(){
        const style = document.createElement('style');
        style.textContent = styleTemplate;
        this.shadowRoot.appendChild(style);
        this.setClass('ephemeral');
        const min = this.offsetWidth;
        const max = window.innerWidth - this.offsetWidth*2;
        const left = Math.floor(Math.random() * (max - min + 1) + min);
        this.style.left = left.toString();
    }

    kill(){
        setTimeout(
            () => {
                this.parentNode.removeChild(this);
            }, this.props.delay
        );
    }
}

customElements.define("game-ephemeral", EphemeralComponent);

export default EphemeralComponent;