import { Component } from 'components/Component/component';

import TopAlbumsTemplate from './topalbums.hbs';
import {AlbumModel} from 'models/album';

interface ITopAlbumsProps {
    albums: Array<AlbumModel>
}

export class TopAlbums extends Component<ITopAlbumsProps> {
    constructor(props) {
        super(props);
    }
    render() {
        return TopAlbumsTemplate({albums: this.props.albums});
    }
}
