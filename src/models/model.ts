import { IModel } from 'components/component/component';

export abstract class Model<TModel = IModel> {
    public attrs: TModel;

    public isLoaded: boolean;

    protected constructor(attrs: TModel = null, isLoaded = false) {
        this.attrs = attrs;
        this.isLoaded = isLoaded;
    }
}
