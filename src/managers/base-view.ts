import {Component} from 'managers/component';
import {IProps} from '../interfaces';

export abstract class View<TProps extends IProps = IProps> extends Component<TProps> {
    hide(): void {
        this.unmount();
        this.props.parent.innerHTML = '';
    }

    show(arg: string): void {
        this.props.arg = arg;
        this.didMount();
        this.render();
    }

    unmount(): void {}
    didMount(): void {}
    abstract render();
}

