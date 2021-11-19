import { Component } from 'components/Component/component';

import SuggestedPlaylistTemplate from './suggestedplaylist.hbs';
import './suggestedplaylist.scss';

interface ISuggestedPlaylistProps {
    artwork: string;
    title: string;
    id: number;
}

export class SuggestedPlaylist extends Component<ISuggestedPlaylistProps> {
    constructor(props) {
        super(props);
        this.props = {
            artwork: props.props.artwork,
            title: props.props.title,
            id: props.props.id,
        };
    }

    render() {
        return SuggestedPlaylistTemplate(this.props);
    }
}
