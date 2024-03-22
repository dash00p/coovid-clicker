import CoreComponent from "./Core.component";

interface IStyledProps extends ICoreComponentProps {
    style: string;
}

class StyledComponent extends CoreComponent {
    constructor(props: IStyledProps = null) {
        super(props);
        this.setStyle(props.style);
    }
}

export default StyledComponent;