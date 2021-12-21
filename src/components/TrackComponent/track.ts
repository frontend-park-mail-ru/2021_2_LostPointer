import { Component } from 'components/Component/component';
import { ArtistModel } from 'models/artist';
import { TrackModel } from 'models/track';

import TrackTemplate from './track.hbs';
import './track.scss';

interface ITrackProps {
    cover: string;
    title: string;
    artist: ArtistModel;
    file: string;
    pos: number;
    album: string;
    is_in_favorites: boolean;
}

export class TrackComponent extends Component<ITrackProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return TrackTemplate(this.props);
    }

    static toggleFavor(event) {
        const { target } = event;
        const trackId = parseInt(
            target.attributes.getNamedItem('data-id').value
        );

        const fav_icon_in_track_list = document.querySelector(
            `.track-fav[data-id="${trackId}"]`
        );
        const fav_icon_in_player = document.querySelector(
            `.player-fav[data-id="${trackId}"]`
        );
        const mobile_fav_icon = document.querySelector(
            `.track-fav-mobile[data-id="${trackId}"]`
        );

        if (target.attributes.getNamedItem('data-in_favorites')) {
            TrackModel.removeFromFavorites(trackId).then(() => {
                if (fav_icon_in_track_list) {
                    fav_icon_in_track_list.removeAttribute('data-in_favorites');
                    (<HTMLImageElement>(
                        fav_icon_in_track_list
                    )).src = `${window.location.origin}/static/img/favorite.svg`;
                }
                if (fav_icon_in_player) {
                    fav_icon_in_player.removeAttribute('data-in_favorites');
                    (<HTMLImageElement>(
                        fav_icon_in_player
                    )).src = `${window.location.origin}/static/img/favorite.svg`;
                }
                if (mobile_fav_icon) {
                    mobile_fav_icon.removeAttribute('data-in_favorites');
                    (<HTMLImageElement>(
                        mobile_fav_icon
                    )).src = `${window.location.origin}/static/img/favorite.svg`;
                }
            });
        } else {
            TrackModel.addInFavorites(trackId).then(() => {
                if (fav_icon_in_track_list) {
                    fav_icon_in_track_list.setAttribute(
                        'data-in_favorites',
                        'true'
                    );
                    (<HTMLImageElement>(
                        fav_icon_in_track_list
                    )).src = `${window.location.origin}/static/img/favorite_green.svg`;
                }
                if (fav_icon_in_player) {
                    fav_icon_in_player.setAttribute(
                        'data-in_favorites',
                        'true'
                    );
                    (<HTMLImageElement>(
                        fav_icon_in_player
                    )).src = `${window.location.origin}/static/img/favorite_green.svg`;
                }
                if (mobile_fav_icon) {
                    mobile_fav_icon.setAttribute('data-in_favorites', 'true');
                    (<HTMLImageElement>(
                        mobile_fav_icon
                    )).src = `${window.location.origin}/static/img/favorite_green.svg`;
                }
            });
        }
    }

    static addToggleFavorListeners() {
        document.querySelectorAll('.track-fav').forEach((button) => {
            button.addEventListener('click', this.toggleFavor);
        });
    }

    static removeToggleFavorListeners() {
        document.querySelectorAll('.track-fav').forEach((button) => {
            button.removeEventListener('click', this.toggleFavor);
        });
    }
}
