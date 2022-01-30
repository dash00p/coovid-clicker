import CoreComponent from "./Core.component";

const customStyle: string = `
  ul {
    padding-top:3px;
    max-height: 60vh;
    overflow-y: auto;
  }
`;

class BuildingListComponent extends CoreComponent {
  static customType: string = "game-building-list";
  constructor(props: object = null) {
    super(props);
    this.create("ul", null);
    this.setStyle(customStyle);
  }
}

customElements.define(BuildingListComponent.customType, BuildingListComponent);

export default BuildingListComponent;
