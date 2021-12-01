import { Component } from 'components/Component/component';
import { TrackComponent } from 'components/TrackComponent/track';

import TracklistTemplate from './tracklist.hbs';
import { TrackModel } from 'models/track';
import './tracklist.scss';

interface ITrackListProps {
    title: string
    tracks: Array<TrackModel>;
}

export class TrackList extends Component<ITrackListProps> {
    private title: string
    private trackComponents: Array<TrackComponent>;

    constructor(props?) {
        super(props);
        this.title = this.props.title;
        if (this.props.tracks) {
            this.trackComponents = this.props.tracks.reduce((acc, item) => {
                acc.push(new TrackComponent(item.getProps()).render());
                return acc;
            }, []);
        }
    }

    set(props: ITrackListProps): this {
        this.props = props;
        this.title = this.props.title;
        if (this.props.tracks) {
            this.trackComponents = this.props.tracks.reduce((acc, item) => {
                acc.push(new TrackComponent(item.getProps()).render());
                return acc;
            }, []);
        }
        return this;
    }

    render() {
        return TracklistTemplate({
            title: this.title,
            tracks: this.trackComponents,
        });
    }
}
