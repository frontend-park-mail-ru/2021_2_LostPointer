import { Component } from 'components/Component/component';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import Request from 'services/request/request';
import player from 'components/Player/player';
import store from 'services/store/store';

import TopbarTemplate from './topbar.hbs';
import './topbar.scss';

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

    addHandlers() {
        if (store.get('authenticated')) {
            document
                .querySelector('.js-logout')
                .addEventListener('click', function logoutHandler() {
                    Request.post('/user/logout').then(() => {
                        player.stop();
                        player.clear();
                        store.set('authenticated', false);
                        window.localStorage.removeItem('lastPlayedData');
                        const button = <HTMLImageElement>(
                            document.querySelector('.js-logout')
                        );

                        if (button) {
                            button.classList.remove(
                                'js-logout',
                                'fa-right-from-bracket'
                            );
                            button.classList.add('fa-right-to-bracket');
                        }

                        document
                            .getElementById('signin-button')
                            .setAttribute('href', '/signin');
                        const ava = document.querySelector('.topbar-profile');
                        if (ava) {
                            ava.remove();
                        }
                        // if (
                        //     window.location.pathname !== routerStore.dashboard
                        // ) {
                        //     router.go(routerStore.dashboard);
                        // }
                    });
                    this.removeEventListener('click', logoutHandler);
                });
        }
    }
}

export default new Topbar();
