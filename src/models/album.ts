import { Model } from './model';
import Request from '../../src/services/request/request';

export interface IAlbumModel {
    album: boolean;
    id: number;
    title: string;
    year: number;
    artist: string;
    artwork: string;
    tracks_count: number;
    tracks_duration: number;
}

export class AlbumModel extends Model<IAlbumModel> {
    constructor(props: IAlbumModel = null) {
        super(props);
    }

    static getHomepageAlbums(): Promise<AlbumModel[]> | Promise<[]> {
        return new Promise((res) => {
            Request.get('/home/albums')
                .then((response) => {
                    sessionStorage.setItem(
                        '/home/albums',
                        JSON.stringify(response)
                    );

                    const albums = response
                        ? response.reduce((acc, elem) => {
                              acc.push(new AlbumModel(elem));
                              return acc;
                          }, [])
                        : [];
                    res(albums);
                })
                .catch(() => {
                    const response = JSON.parse(
                        sessionStorage.getItem('/home/albums')
                    );
                    if (response) {
                        const albums: Array<AlbumModel> = response
                            ? response.reduce((acc, elem) => {
                                  acc.push(new AlbumModel(elem));
                                  return acc;
                              }, [])
                            : [];
                        res(albums);
                    } else {
                        const emptyAlbum = new AlbumModel({
                            id: 0,
                            title: 'Loading album name...',
                            year: 0,
                            artist: 'Loading artist name...',
                            artwork: 'loading',
                            tracks_count: 0,
                            tracks_duration: 0,
                            album: false,
                        });

                        res(Array.from({ length: 4 }, () => emptyAlbum));
                    }
                });
        });
    }

    isSingle(): boolean {
        return this.props.tracks_count === 1;
    }
}
