import BaseComponent from "./common/BaseComponent";
import ElementRender from "../logic/core/Element.logic";

class HeadComponent extends BaseComponent {
    declare state: {
        scripts: string[],
    }

    constructor(props: object = null) {
        super({ disableShadow: true, ...props });
        //this.getScripts();

        this.state = {
            scripts: [
                /*`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://qszkms53q3ctbma47bpkilhpn40wmomq.lambda-url.eu-west-1.on.aws?q=https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "lru4v6vavm");`*/],
        };
        document.head.appendChild(this);
    }

    render() {
        return (<>
            {this.state.scripts.map((scriptContent: string) => <script type="text/javascript" async>{scriptContent}</script>)}
        </>);
    }

}

customElements.define("game-head", HeadComponent);

export default HeadComponent;