import { Component } from 'components/Component/component';

import SuggestedArtistsTemplate from './suggestedartists.hbs';
import { ArtistModel } from 'models/artist';
import './suggestedartists.scss';

interface ISuggestedArtistsProps {
    artists: Array<ArtistModel>;
    extraRounded?: boolean;
}

export class SuggestedArtists extends Component<ISuggestedArtistsProps> {
    private extraRounded: boolean;

    constructor(props) {
        super(props);
        this.extraRounded = this.props.extraRounded || false;
    }

    render() {
        return SuggestedArtistsTemplate({ artists: this.props.artists, extra_rounded: this.extraRounded });
    }
}
