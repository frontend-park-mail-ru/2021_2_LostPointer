import { Component } from 'components/Component/component';
import { TrackComponent } from 'components/TrackComponent/track';

import TracklistTemplate from './tracklist.hbs';
import { TrackModel } from 'models/track';
import './tracklist.scss';

interface ITrackListProps {
    tracks: Array<TrackModel>;
}

export class TrackList extends Component<ITrackListProps> {
    private trackComponents: Array<TrackComponent>;

    constructor(props) {
        super(props);
        this.trackComponents = this.props.tracks.reduce((acc, item) => {
            acc.push(new TrackComponent(item.getProps()).render());
            return acc;
        }, []);
    }
    render() {
        return TracklistTemplate({ tracks: this.trackComponents });
    }
}
