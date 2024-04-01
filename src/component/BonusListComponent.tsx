import style from "../css/bonus.component.scss";
import Bonus from "../logic/Bonus.logic";
import ElementRender from "../logic/core/Element.logic";
import BonusComponent from "./BonusComponent";
import BaseComponent from "./common/BaseComponent";

class BonusListComponent extends BaseComponent {
  declare state: {
    bonusList: IBonus[];
  };

  constructor(props: object = null) {
    super({ ...props, style });
    // this.create("h4", "Mesures gouvernementales");
    // this.create("ul", null);
    this.observe(Bonus.getInstance().state, 'availableBonus', 'bonusList');
  }

  // addBonus(bonus: IBonus): void {
  //   this.bonusList.push({ ...bonus, isPurchased: false });
  // }

  // add observer when bonusList is updated.
  // addObserver() {
  //   const self = this;
  //   this.bonusList = new Proxy(this.bonusList, {
  //     set(target, property, value) {
  //       self.renderCount++;
  //       target[property] = value;
  //       const newContent = self.newRender();
  //       self.shadowRoot.replaceChildren(newContent); // Call your observer function here
  //       return true;
  //     },
  //   });
  // }

  render() {
    return (
      <div>
        <h4>Mesures gouvernementales</h4>
        <ul>
          {this.state.bonusList
            .filter(bonus => !bonus.isPurchased)
            .map((bonus) => (
              <BonusComponent
                cost={bonus.cost}
                name={bonus.name}
                neededProduction={bonus.neededProduction}
                type={bonus.type}
                value={bonus.value}
                id={bonus.id}
              />
            ))}
        </ul>
      </div>
    );
  }
}

customElements.define("game-bonus-list", BonusListComponent);

export default BonusListComponent;
