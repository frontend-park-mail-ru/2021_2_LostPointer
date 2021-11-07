import { Component } from 'components/Component/component';

import TopbarTemplate from './topbar.hbs';
import './topbar.scss';

interface ITopbarComponentProps {
    authenticated: boolean;
    avatar: string;
    offline: boolean;
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
        const button = <HTMLImageElement>document.querySelector('.js-logout');
        button.classList.remove('js-logout', 'fa-right-from-bracket');
        button.classList.add('fa-right-to-bracket');
        button.nextSibling.remove();

        button.setAttribute('data-link', '');
        button.removeAttribute('data-action');
        button.setAttribute('href', '/signin');
        (<HTMLImageElement>document.querySelector('.topbar-profile')).remove();
    }
}

export default new Topbar();
