class BuildingList extends HTMLUListElement {
    constructor() {
      // toujours appeler « super » en premier dans le constructeur
      super();
    }
  }

  customElements.define("game-building-list", BuildingList, { extends: "ul" });

  export default BuildingList;