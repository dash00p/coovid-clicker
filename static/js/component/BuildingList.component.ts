import StyledComponent from "./common/Styled.component";

const style: string = `
  ul {
    padding-top:3px;
    max-height: 60vh;
    overflow-y: auto;
  }
`;

interface IBuildingListState extends ICoreComponentsState {
  buildingCount: number | null;
}

class BuildingListComponent extends StyledComponent {
  static customType: string = "game-building-list";
  declare state: IBuildingListState;

  constructor(props: object = null) {
    super({ ...props, style });
    this.create("ul", null);
  }
}

customElements.define(BuildingListComponent.customType, BuildingListComponent);

export default BuildingListComponent;
