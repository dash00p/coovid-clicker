import { log } from "../helper/Console.helper";
import Bonus from "../logic/Bonus.logic";
import Building from "../logic/Building.logic";
import ElementRender from "../logic/core/Element.logic";
import BuildingComponent from "./BuildingComponent";
import BaseComponent from "./common/BaseComponent";

const style: string = `
  ul {
    padding-top:3px;
    max-height: 60vh;
    overflow-y: auto;
  }
`;

class BuildingListComponent extends BaseComponent {
  declare state: {
    currentBuildings: IBuilding[]
    productionMultiplicator: number;
    buildingPurchaseDivisor: number;
    scrollPosition: number;
  };

  constructor(props: object = null) {
    super({ ...props, style });
    this.observe(Building.getInstance().state, 'currentBuildings');
    this.observe(Bonus.getInstance().state, 'productionMultiplicator');
    this.observe(Bonus.getInstance().state, 'buildingPurchaseDivisor');
  }

  componentWillUpdate(): void {
    const element = this.shadowRoot.querySelector('ul');
    if (element) {
      this.state.scrollPosition = element.scrollTop;
    }
  }

  // preserve the scroll position on the building list
  componentDidUpdate(): void {
    const element = this.shadowRoot.querySelector('ul');
    if (element) {
      element.scrollTop = this.state.scrollPosition;
    }
  }

  render() {
    log("rendering building list");
    return (<ul>
      {this.state.currentBuildings.map((building: IBuilding) => <BuildingComponent building={building} productionMultiplicator={this.state.productionMultiplicator} currentPriceDivider={this.state.buildingPurchaseDivisor} />)}
    </ul>);
  }
}

customElements.define("game-building-list", BuildingListComponent);

export default BuildingListComponent;
