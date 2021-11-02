import {AlbumModel} from 'models/album';
import {Component} from 'components/Component/component';

import SuggestedAlbumsTemplate from './suggestedAlbums.hbs';

interface ISuggestedAlbums {
    albums: Array<AlbumModel>;
}

export class SuggestedAlbums extends Component<ISuggestedAlbums> {
    constructor(props) {
        super(props);
    }

    render() {
        return SuggestedAlbumsTemplate({albums: this.props.albums });
    }
}
