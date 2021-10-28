export abstract class  Component<TProps> {

    protected props: TProps;

    constructor(props?: TProps) {
        this.props = {...props};
    }

    getProps(): TProps {
        return this.props;
    }

    abstract render(): void;
}
