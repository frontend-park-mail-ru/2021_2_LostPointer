import {IProps} from "src/interfaces";

export abstract class  Component<TProps = IProps> {

    protected isLoaded: boolean;
    protected template: any;
    protected props: TProps;

    constructor(props?: TProps) {
        this.props = {...props};
    }

    abstract render(): void;
}


