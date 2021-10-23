import { Component } from 'components/component/component';
import { Track } from '../track/track';

import TracklistTemplate from './tracklist.hbs';

interface ITrackListProps {
    tracks: Array<any>
}

class TrackList extends Component<ITrackListProps> {
    constructor(props) {
        super(props);
        let pos = 0;
        this.props.tracks = props.tracks.map((e) => {
            e.pos = pos++;
            return { track: new Track(e).render() };
        });
    }
    render() {
        return TracklistTemplate({tracks: this.props.tracks});
    }
}

export { TrackList };
