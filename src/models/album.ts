import { Model } from './model';
import Request from '../../src/services/request/request';

export interface IAlbumModel {
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
                    const emptyAlbum = new AlbumModel({
                        id: 0,
                        title: 'Loading album name...',
                        year: 0,
                        artist: 'Loading artist name...',
                        artwork: '/static/img/loading.webp',
                        tracksCount: 0,
                        tracksDuration: 0,
                    });

                    res(Array.from({length: 4}, () => emptyAlbum));
                });
        });
    }
}
