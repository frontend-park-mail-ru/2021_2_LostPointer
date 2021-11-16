import { Component } from 'components/Component/component';

import MobileFooterTemplate from './mobile.hbs';
import './mobile.scss';

interface IMobileFooterProps {
    nowPlaying: string;
    liked: boolean;
}

export class MobileFooter extends Component<IMobileFooterProps> {
    constructor() {
        super();
    }

    render(): string {
        return MobileFooterTemplate(this.props);
    }
}

export default new MobileFooter();
