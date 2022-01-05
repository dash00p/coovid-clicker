import CoreComponent from "./Core.component";

class BuildingListComponent extends CoreComponent {
  static customType: string = "game-building-list";
  constructor(props: object = null) {
    super(props);
  }
}

customElements.define(BuildingListComponent.customType, BuildingListComponent);

export default BuildingListComponent;