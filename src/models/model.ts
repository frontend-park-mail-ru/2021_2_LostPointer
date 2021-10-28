export abstract class Model<TModel> {
    public props: TModel;

    protected constructor(props: TModel = null) {
        this.props = props;
    }

    getProps(): TModel {
        return this.props;
    }
}
