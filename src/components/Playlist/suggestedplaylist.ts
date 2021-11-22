import { Component } from 'components/Component/component';

import SuggestedPlaylistTemplate from './suggestedplaylist.hbs';
import './suggestedplaylist.scss';

interface ISuggestedPlaylistProps {
    artwork: string;
    title: string;
    id: number;
    is_public: boolean;
}

export class SuggestedPlaylist extends Component<ISuggestedPlaylistProps> {
    constructor(props) {
        super(props);
        this.props = {
            artwork: props.props.artwork,
            title: props.props.title,
            id: props.props.id,
            is_public: props.props.is_public,
        };
    }

    render() {
        return SuggestedPlaylistTemplate(this.props);
    }
}
