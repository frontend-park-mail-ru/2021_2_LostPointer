import { Component } from 'components/Component/component';

import SuggestedArtistsTemplate from './suggestedartists.hbs';
import {Artist} from "models/artist";

interface ISuggestedArtistsProps {
    artists: Array<Artist>;
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
