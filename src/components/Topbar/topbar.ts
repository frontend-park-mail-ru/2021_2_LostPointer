import { Component } from 'components/Component/component';

import TopbarTemplate from './topbar.hbs';
import './topbar.scss';
import router from 'services/router/router';

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
        if (button) {
            button.classList.remove('js-logout', 'fa-right-from-bracket');
            button.classList.add('fa-right-to-bracket');
        }

        document
            .getElementById('signin-button')
            .setAttribute('href', '/signin');
        router.go(window.location.pathname);
    }
}

export default new Topbar();
