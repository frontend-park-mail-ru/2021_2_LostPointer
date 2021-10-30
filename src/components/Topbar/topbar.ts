import { Component } from 'components/Component/component';

import TopbarTemplate from './topbar.hbs';
import './topbar.scss'

interface ITopbarComponentProps {
    authenticated: boolean;
    avatar: string;
}

export class Topbar extends Component<ITopbarComponentProps> {
    render() {
        return TopbarTemplate(this.props);
    }

    set(props: ITopbarComponentProps): this {
        this.props = props;
        return this;
    }

    logout() {
        const button = <HTMLImageElement>document.querySelector('.topbar-auth');
        button.src = '/src/static/img/login.png';
        button.setAttribute('data-link', '');
        button.removeAttribute('data-action');
        button.setAttribute('href', '/signin');
        (<HTMLImageElement>document.querySelector('.topbar-profile')).remove();
    }
}

export default new Topbar();
