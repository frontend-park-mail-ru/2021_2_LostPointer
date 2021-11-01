import { Component } from 'components/Component/component';
import { TrackComponent } from 'components/TrackComponent/track';

import TracklistTemplate from './tracklist.hbs';
import { TrackModel } from 'models/track';

interface ITrackListProps {
    title: string
    tracks: Array<TrackModel>;
}

export class TrackList extends Component<ITrackListProps> {
    private title: string
    private trackComponents: Array<TrackComponent>;

    constructor(props) {
        super(props);
        this.title = this.props.title;
        this.trackComponents = this.props.tracks.reduce((acc, item) => {
            acc.push(new TrackComponent(item.getProps()).render());
            return acc;
        }, []);
    }
    render() {
        return TracklistTemplate({
            title: this.title,
            tracks: this.trackComponents,
        });
    }
}
