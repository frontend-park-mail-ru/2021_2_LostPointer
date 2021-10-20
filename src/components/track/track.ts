import { Component } from 'managers/component';

const TrackTemplate = require('./track.hbs');

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
        this.props = {
            cover: props.cover,
            title: props.title,
            artist: props.artist,
            file: props.file,
            pos: props.pos,
            album: props.album,
        };
        this.template = TrackTemplate;
    }

    render() {
        return TrackTemplate(this.props);
    }
}

export { Track };
