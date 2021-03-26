class BuildingList extends HTMLUListElement {
    constructor() {
      // Toujours appeler « super » en premier dans le constructeur
      super();
    }
  }

  customElements.define('game-building-list', BuildingList, { extends: 'ul' });

  export default BuildingList;