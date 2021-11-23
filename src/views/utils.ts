import { PlaylistModel } from 'models/playlist';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';

export function disableBrokenImg(event) {
    event.target.style.display = 'none';
}

function toggleMenu(command) {
    this.renderedMenu.style.visibility = command === 'show' ? 'visible' : 'hidden';
    this.renderedMenu.style.opacity = command === 'show' ? '1' : '0';
    this.menuVisible = command === 'show';
}

export function hideContextMenu() {
    if (!this.authenticated) {
        return;
    }
    if (this.menuVisible) {
        toggleMenu.call(this, 'hide');
    }
}

export function showContextMenu(event) {
    if (!this.authenticated) {
        router.go(routerStore.signin);
        return;
    }
    this.selectedTrackId = parseInt(event.target.getAttribute('data-id'));
    const rect = event.target.getBoundingClientRect();
    this.renderedMenu.style.left = `${rect.left + 10}px`;
    this.renderedMenu.style.top = `${rect.top + 10}px`;
    toggleMenu.call(this, 'show');
    event.stopPropagation();
}

export function addTrackToPlaylist(event) {
    const playlistId = parseInt(event.target.getAttribute('data-id'));
    const trackId = this.selectedTrackId;

    PlaylistModel.addTrack(playlistId, trackId)
        .then((response) => {
            if (response.status === 201) {
                // TODO показываем уведомление
            } else if (response.status === 400) {
                // TODO показываем уведомление
            }
        });
}

export function createNewPlaylist() {
    const trackId = this.selectedTrackId;

    const formdata = new FormData();
    formdata.append('title', 'New playlist');

    PlaylistModel.createPlaylist(formdata)
        .then(({id}) => {
            PlaylistModel.addTrack(id, trackId)
                .then((response) => {
                    if (response.status === 201) {
                        router.go(`${routerStore.playlist}/${id}`);
                    }
                });
        });
}

export function removeTrackFromPlaylist() {
    const playlistId = this.playlist.getProps().id;
    const trackId = this.selectedTrackId;

    PlaylistModel.removeTrack(playlistId, trackId)
        .then((response) => {
            if (response.status === 200) {
                this.playlist.getProps().tracks.splice(
                    this.playlist.getProps().tracks.findIndex((track) => {
                        return track.getProps().id === trackId
                    }), 1
                );

                this.render();
            }
        });
}
