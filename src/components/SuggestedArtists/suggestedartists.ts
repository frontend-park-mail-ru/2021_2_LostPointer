import { Component } from 'components/Component/component';

import SuggestedArtistsTemplate from './suggestedartists.hbs';
import { ArtistModel } from 'models/artist';
import './suggestedartists.scss';

interface ISuggestedArtistsProps {
    artists: Array<ArtistModel>;
}

export class SuggestedArtists extends Component<ISuggestedArtistsProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return SuggestedArtistsTemplate({ artists: this.props.artists });
    }
}
