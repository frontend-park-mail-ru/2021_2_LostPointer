export abstract class Model<TModel> {
    public props: TModel;

    public isLoaded: boolean;

    protected constructor(props: TModel = null, isLoaded = false) {
        this.props = props;
        this.isLoaded = isLoaded;
    }
}
