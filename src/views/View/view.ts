export abstract class View<TProps> {
    protected isLoaded: boolean;
    protected props: TProps;

    constructor(props?: TProps) {
        this.props = { ...props };
    }

    abstract didMount(): void;

    abstract render(): void;

    abstract unmount(): void;
}
