import { Component } from 'components/Component/component';

import TopbarTemplate from './topbar.hbs';
import './topbar.scss';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';

interface ITopbarComponentProps {
    authenticated: boolean;
    avatar: string;
    offline: boolean;
}

export class Topbar extends Component<ITopbarComponentProps> {
    constructor() {
        super();
    }

    didMount() {
        const searchField = document.querySelector('.topbar__search-input');
        searchField.addEventListener('focus', () => {
            if (window.location.pathname != routerStore.search) {
                router.go(routerStore.search);
            }
        });
    }

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
