import { Component } from 'components/Component/component';
import { TrackComponent } from 'components/TrackComponent/track'

import TracklistTemplate from './tracklist.hbs';

interface ITrackListProps {
    tracks: Array<TrackComponent>
}

class TrackList extends Component<ITrackListProps> {
    constructor(props) {
        super(props);
        this.props.tracks = props.tracks.map((item, index) => {
            item.pos = index;
            return { track: new TrackComponent(item).render() };
        });
    }
    render() {
        return TracklistTemplate({tracks: this.props.tracks});
    }
}

export { TrackList };
