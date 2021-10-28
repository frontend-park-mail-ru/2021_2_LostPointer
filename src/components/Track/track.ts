import { Component } from 'components/Component/component';

import TrackTemplate from './track.hbs';

interface ITrackProps {
    cover: string;
    title: string;
    artist: string;
    file: string;
    pos: number;
    album: string;
}

class Track extends Component<ITrackProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return TrackTemplate(this.props);
    }
}

export { Track };
