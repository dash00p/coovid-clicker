import ModalComponent, { IModalComponentProps } from "../common/Modal.component";
import { commarize } from "../../helper/Dom.helper";
import Stats from "../../logic/Stats.logic";
import Bonus from "../../logic/Bonus.logic";
import Building from "../../logic/Building.logic";

interface IStatsComponentState extends ICoreComponentsState {
    list: IStat;
}

class StatsComponent extends ModalComponent {
    declare state: IStatsComponentState;

    constructor(props: IModalComponentProps = null) {
        super(props);

        this.render();
        this.listen(this, "list", Stats.getInstance().list, [this.renderStats]);
        this.updateStats();
    }

    renderStats(): void {
        const stats = Stats.getInstance().list;
        this.updateContent(this.find("#statsList"), `
            <li>Nombre de clics : ${stats.clickCount}</li>
            <li>Vaccins générés : ${commarize(stats.totalEarnings, 3, false)}</li>
            <li>Perks activés : ${stats.perkCount}</li>
            <li>Unités engagées : ${stats.buildingCount}</li>`);
    }

    render(): void {
        const BuildingUpgrades = Building.getInstance().currentBuildings
            .filter(b => b.activeUpgrades.length)
            .map(building => ({ name: building.name, img: building.img, upgrades: building.activeUpgrades }));
        this.updateContent(this.find(".modal-content"), `
        <h2>Statistiques</h2>
        <ul id="statsList">
        </ul>
        <h2>Bonus débloqués</h2>
        <ul>
            ${Bonus.getInstance().availableBonus.map((bonus: IBonus) => `<li>${bonus.name}</li>`).join("")}
        </ul>
        <h2>Améliorations débloquées</h2>
        <ul>
            ${BuildingUpgrades.map((bonus) => `<li>${bonus.img ? `<img src="${bonus.img.src}" />` : bonus.name} 
                <ul>
                    ${bonus.upgrades.map((upgrade) => `<li>${upgrade.name}</li>`).join("")}
                </ul>
            </li>`).join("")}
        </ul>`);
    }


    updateStats(): void {
        this.setInterval(() => {
            Stats.getInstance().update();
            this.state.list = Stats.getInstance().list;
        }, 500);
    }
}

customElements.define("game-stat", StatsComponent);

export default StatsComponent;
