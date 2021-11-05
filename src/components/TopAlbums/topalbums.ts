import { Component } from 'components/Component/component';

import TopAlbumsTemplate from './topalbums.hbs';
import { AlbumModel } from 'models/album';
import './topalbums.scss';

interface ITopAlbumsProps {
    albums: Array<AlbumModel>;
}

export class TopAlbums extends Component<ITopAlbumsProps> {
    private albums: Array<AlbumModel>;

    constructor(props) {
        super(props);
        this.albums = this.props.albums.reduce((acc, album) => {
            const alb = album;
            alb.props.album = !alb.isSingle();
            acc.push(alb);
            return acc;
        }, []);
    }

    render() {
        return TopAlbumsTemplate({ albums: this.albums });
    }
}
