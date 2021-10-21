import { Component } from 'components/component/component';

const SuggestedPlaylistTemplate = require('./suggestedplaylist.hbs');

interface ISuggestedPlaylistProps {
    cover: string,
    title: string
}

class SuggestedPlaylist extends Component<ISuggestedPlaylistProps> {
    constructor(props) {
        super(props);
        this.props = {
            cover: props.cover,
            title: props.title,
        };
    }

    render() {
        return SuggestedPlaylistTemplate(this.props);
    }
}

export { SuggestedPlaylist };
