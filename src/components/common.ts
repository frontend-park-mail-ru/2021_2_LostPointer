import store from 'services/store/store';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import PlayerComponent from 'components/Player/player';
import bus from 'services/eventbus/eventbus';

const playButtonHandler = function (e) {
    if (e.target.className === 'track-list-item-play') {
        if (!store.get('authenticated')) {
            router.go(routerStore.signin);
            return;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (this.firstTimePlayed) {
            PlayerComponent.setup(
                document.querySelectorAll('.track-list-item')
            );
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.firstTimePlayed = false;
        }
        if (e.target === store.get('nowPlaying')) {
            // Ставим на паузу/продолжаем воспр.
            return;
        }
        if (store.get('nowPlaying')) {
            // Переключили на другой трек
            store.get('nowPlaying').dataset.playing = 'false';
            store.get('nowPlaying').src = '/static/img/play-outline.svg';
        }
        bus.emit('set-player-pos', {
            pos: parseInt(e.target.dataset.pos, 10),
            target: e.target,
        });

        bus.emit('set-player-track', {
            url: `/static/tracks/${e.target.dataset.url}`,
            cover: `/static/artworks/${e.target.dataset.cover}`,
            title: e.target.dataset.title,
            artist: e.target.dataset.artist,
            artist_id: e.target.dataset.artist_id,
            album: e.target.dataset.album,
        });

        e.target.dataset.playing = 'true';
        store.set('nowPlaying', e.target);
    }
};

export { playButtonHandler };
