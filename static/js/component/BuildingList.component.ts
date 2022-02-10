import CoreComponent from "./Core.component";

const customStyle: string = `
  ul {
    padding-top:3px;
    max-height: 60vh;
    overflow-y: auto;
  }
`;

interface IBuildingListState extends ICoreComponentsState {
  buildingCount: number | null;
}

class BuildingListComponent extends CoreComponent {
  static customType: string = "game-building-list";
  declare state: IBuildingListState;

  constructor(props: object = null) {
    super(props);
    this.create("ul", null);
    this.render(this.create("p", "Nombre d'unités total : <span></span>"));
    this.listen(this, "buildingCount", 0, [this.renderBuildingCount]);
    this.setStyle(customStyle);
  }

  renderBuildingCount(): void {
    this.updateContent(this.find("span"), `${this.state.buildingCount}`);
  }
}

customElements.define(BuildingListComponent.customType, BuildingListComponent);

export default BuildingListComponent;
