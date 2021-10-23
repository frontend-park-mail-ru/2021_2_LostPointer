import { Component } from '../component/component';

import SuggestedArtistsTemplate from './suggestedartists.hbs';

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
