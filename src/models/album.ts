import { Model } from './model';
import Request from '../../src/services/request/request';

export interface IAlbumModel {
    album: boolean;
    id: number;
    title: string;
    year: number;
    artist: string;
    artwork: string;
    tracksCount: number;
    tracksDuration: number;
}

export class AlbumModel extends Model<IAlbumModel> {
    constructor(props: IAlbumModel = null) {
        super(props);
    }

    static getHomepageAlbums(): Promise<AlbumModel[]> | Promise<[]> {
        return new Promise((res) => {
            Request.get('/home/albums')
                .then((response) => {
                    const albums: Array<AlbumModel> = response.reduce(
                        (acc, elem) => {
                            acc.push(new AlbumModel(elem));
                            return acc;
                        },
                        []
                    );
                    res(albums);
                })
                .catch(() => {
                    res([]);
                });
        });
    }

    isSingle(): boolean {
        return this.props.tracksCount === 1;
    }
}
