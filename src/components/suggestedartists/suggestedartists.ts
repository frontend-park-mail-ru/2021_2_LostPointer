import { Component } from '../../managers/component';

const SuggestedArtistsTemplate = require('./suggestedartists.hbs');

class SuggestedArtists extends Component {
    constructor(props) {
        super(props);
        this.template = SuggestedArtistsTemplate;
    }
}

export { SuggestedArtists };
