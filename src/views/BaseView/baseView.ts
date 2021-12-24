import { View } from 'views/View/view';
import TopbarComponent from 'components/Topbar/topbar';
import store from 'services/store/store';
import sidebar from 'components/Sidebar/sidebar';
import player from 'components/Player/player';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';
import mobile from 'components/Mobile/mobile';

import BaseViewTemplate from './baseView.hbs';
import './baseView.scss';

class BaseView extends View<never> {
    private mounted: boolean;

    render() {
        if (this.mounted) {
            document.querySelector('.js-menu-container').innerHTML =
                playlistsContextMenu.render();
            return;
        }
        document.getElementById('app').innerHTML = BaseViewTemplate({
            topbar: TopbarComponent.set({
                authenticated: store.get('authenticated'),
                avatar: store.get('userAvatar'),
                offline: !navigator.onLine,
            }).render(),
            sidebar: sidebar.render(),
            player: player.render(),
            contextMenu: playlistsContextMenu.render(),
            mobile: mobile.set(player.getNowPlaying()).render(),
        });
        if (!player.isDisplayed()) {
            document.querySelector('.player').classList.add('none');
            document
                .querySelector('.app__content')
                .classList.add('app__content-without-player');
            document
                .querySelector('.mobile-footer__player')
                .classList.add('none');
            document
                .querySelector('.mobile-footer__player__progress')
                .classList.add('none');
            document.documentElement.style.setProperty(
                '--mobile-footer-height',
                '50px'
            );
        }
        this.mounted = true;

        TopbarComponent.addHandlers();
        TopbarComponent.didMount();

        player.setEventListeners();
    }

    unmount(): void {
        this.mounted = false;
    }
}

export default new BaseView();
