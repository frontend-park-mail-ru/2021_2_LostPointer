import { Component } from 'components/Component/component';
import { ArtistModel } from 'models/artist';
import playlistsContextMenu from 'components/PlaylistsContextMenu/playlistsContextMenu';

import TrackTemplate from './track.hbs';
import './track.scss';

interface ITrackProps {
    cover: string;
    title: string;
    artist: ArtistModel;
    file: string;
    pos: number;
    album: string;
}

export class TrackComponent extends Component<ITrackProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return TrackTemplate(this.props);
    }

    static addShowContextMenuListeners() {
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.addEventListener(
                    'click',
                    playlistsContextMenu.showContextMenu.bind(
                        playlistsContextMenu
                    )
                );
            });
    }

    static removeShowContextMenuListeners() {
        document
            .querySelectorAll('.track-list-item-playlist')
            .forEach((element) => {
                element.removeEventListener(
                    'click',
                    playlistsContextMenu.showContextMenu.bind(
                        playlistsContextMenu
                    )
                );
            });
    }
}
