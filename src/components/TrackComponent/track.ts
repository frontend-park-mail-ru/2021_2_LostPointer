import { Component } from 'components/Component/component';

import { ArtistModel } from 'models/artist';

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
}
