import CoreComponent from "../component/Core.component";

export interface IEnhancedHTMLElement extends HTMLElement {
    component?: CoreComponent;
    props?: any;
}