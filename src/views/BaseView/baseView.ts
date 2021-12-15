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

    constructor() {
        super();
    }

    render() {
        if (this.mounted) {
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
