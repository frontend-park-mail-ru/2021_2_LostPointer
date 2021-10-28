import { Component } from 'components/Component/component';
import { Track } from '../Track/track';

import TracklistTemplate from './tracklist.hbs';

interface ITrackListProps {
    tracks: Array<Track>
}

class TrackList extends Component<ITrackListProps> {
    constructor(props) {
        super(props);
        this.props.tracks = props.tracks.map((item, index) => {
            item.pos = index;
            return { track: new Track(item).render() };
        });
    }
    render() {
        return TracklistTemplate({tracks: this.props.tracks});
    }
}

export { TrackList };
