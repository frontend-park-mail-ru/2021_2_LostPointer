import { Component } from 'managers/component';

const SuggestedPlaylistTemplate = require('./suggestedplaylist.hbs');

class SuggestedPlaylist extends Component {
    constructor(props) {
        super(props);
        this.data = {
            cover: props.cover,
            title: props.title,
        };
        this.template = SuggestedPlaylistTemplate;
    }
}

export { SuggestedPlaylist };
