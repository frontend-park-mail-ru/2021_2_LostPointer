import { Component } from 'managers/component';
import { Track } from '../track/track';

const TracklistTemplate = require('./tracklist.hbs');

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
        this.template = TracklistTemplate;
    }
    render() {
        return TracklistTemplate({tracks: this.props.tracks});
    }
}

export { TrackList };
