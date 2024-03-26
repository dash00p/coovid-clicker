import CoreComponent from "./Core.component";

class StyledComponent extends CoreComponent {
    constructor(props: IStyledComponentProps = null) {
        super(props);
        this.setStyle(props.style);
    }
}

export default StyledComponent;