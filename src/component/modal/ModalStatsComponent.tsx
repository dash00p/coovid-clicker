import ModalComponent from "../common/ModalComponent";

import { commarize } from "../../helper/Dom.helper";
import Stats from "../../logic/Stats.logic";
import Bonus from "../../logic/Bonus.logic";
import Building from "../../logic/Building.logic";
import ElementRender from "../../logic/core/Element.logic";
import BaseComponent from "../common/BaseComponent";
import Modal from "../../logic/Modal.logic";

interface IStatBuilding {
    name: string;
    img: { src: string };
    upgrades: IBuildingUpgrade[];
}

const style: string = `
  img {
    max-width: 40px;
  }
`;

class StatsComponent extends BaseComponent {
    stats: IStat;

    constructor(props: object = null) {
        super({ ...props });
        this.stats = Stats.getInstance().list;
        this.updateStats();
    }

    updateStats(): void {
        const callback =
            () => {
                Stats.getInstance().update();
                this.rerender()
            };
        this.setInterval(callback, 500);
    }

    render() {
        return (
            <ul>
                <li>Nombre de clics : {this.stats.clickCount}</li>
                <li>Vaccins générés : {commarize(this.stats.totalEarnings, 3, false)}</li>
                <li>Perks activés : {this.stats.perkCount}</li>
                <li>Unités engagées : {this.stats.buildingCount}</li>
            </ul>
        );
    }
}
customElements.define("game-stats", StatsComponent);

class ModalStatsComponent extends BaseComponent {
    buildingUpgrades: IStatBuilding[];

    constructor(props: object = null) {
        super({ ...props, style });
        this.buildingUpgrades = Building.getInstance().currentBuildings
            .filter(b => b.activeUpgrades.length)
            .map(building => ({ name: building.name, img: building.img, upgrades: building.activeUpgrades }));
    }

    callbackAfterRemove() {
        Modal.getInstance().removeModal(this);
    }

    render() {
        return (
            <ModalComponent style={style} onClose={() => { this.kill() }}>
                <h3>Statistiques</h3>
                <StatsComponent />
                <h3>Bonus débloqués</h3>
                <ul>
                    {Bonus.getInstance().availableBonus.filter(b => b.isPurchased).map((bonus: IBonus) => <li>{bonus.name}</li>)}
                </ul>
                <h3>Améliorations débloquées</h3>
                <ul>
                    {this.buildingUpgrades.map((bonus) => <li>{bonus.img ? <img src={bonus.img.src} /> : ``} {bonus.name}
                        <ul>
                            {bonus.upgrades.map((upgrade) => <li>{upgrade.name}</li>)}
                        </ul>
                    </li>)}
                </ul>
            </ModalComponent>);
    }
}

customElements.define("game-modal-stats", ModalStatsComponent);

export default ModalStatsComponent;
