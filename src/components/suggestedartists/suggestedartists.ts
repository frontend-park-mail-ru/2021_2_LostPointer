import { Component } from '../component/component';

const SuggestedArtistsTemplate = require('./suggestedartists.hbs');

interface ISuggestedArtistsProps {
    artists: Array<any>;
}

class SuggestedArtists extends Component<ISuggestedArtistsProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return SuggestedArtistsTemplate({ artists: this.props.artists });
    }
}

export { SuggestedArtists };
