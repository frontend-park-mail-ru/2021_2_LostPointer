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
        if (target.attributes.getNamedItem('data-in_favorites')) {
            TrackModel.removeFromFavorites(trackId).then(() => {
                target.removeAttribute('data-in_favorites');
                target.src = `${window.location.origin}/static/img/favorite.svg`;
            });
        } else {
            TrackModel.addInFavorites(trackId).then(() => {
                target.setAttribute('data-in_favorites', 'true');
                target.src = `${window.location.origin}/static/img/favorite_green.svg`;
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
