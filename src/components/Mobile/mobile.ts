import { Component } from 'components/Component/component';

import MobileFooterTemplate from './mobile.hbs';
import './mobile.scss';
import { IPlayerComponentProps } from 'components/Player/player';

export class MobileFooter extends Component<IPlayerComponentProps> {
    constructor() {
        super();
    }

    set(props: IPlayerComponentProps) {
        this.props = { ...props };
        return this;
    }

    render(): string {
        return MobileFooterTemplate(this.props);
    }
}

export default new MobileFooter();
