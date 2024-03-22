import CoreComponent from "./common/Core.component";

class CounterComponent extends CoreComponent {
  static customType: string = "game-counter";

  constructor(props: object = null) {
    super(props);
    this.setHTML(`<span id="counter"></span> de vaccins (<span id="productionCounter"></span>
    doses produites par seconde)
    <br />`);
  }
}

customElements.define(CounterComponent.customType, CounterComponent);

export default CounterComponent;
