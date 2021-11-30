import { Model } from './model';
import Request from '../../src/services/request/request';
import { mockTrack, TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';

export interface IAlbumModel {
    album: boolean;
    id: number;
    title: string;
    year: number;
    artist: string;
    artwork: string;
    artwork_color: string;
    tracks_count: number;
    tracks_duration: number;
    tracks: Array<TrackModel>;
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
                        res(Array.from({ length: 4 }, () => mockAlbum));
                    }
                });
        });
    }

    static getAlbum(albumId: string): Promise<AlbumModel> | Promise<null> {
        return new Promise<AlbumModel>((res) => {
            Request.get(`/album/${albumId}`)
                .then((response) => {
                    if ('status' in response && response.status !== 200) {
                        return res(null);
                    }

                    response.tracks = response.tracks.reduce(
                        (acc, elem, index) => {
                            elem.pos = index;
                            elem.album = new AlbumModel(response);
                            elem.artist = new ArtistModel(response.artist);
                            acc.push(new TrackModel(elem));
                            return acc;
                        },
                        [],
                    );
                    res(new AlbumModel(response));
                })
                .catch(() => {
                    const emptyAlbum = mockAlbum;
                    emptyAlbum.props.artist = 'Loading artist name...';
                    emptyAlbum.props.tracks = Array.from({ length: 4 }, () => mockTrack);
                    res(emptyAlbum);
                });
        });
    }

    isSingle(): boolean {
        return this.props.tracks_count === 1;
    }
}

export const mockAlbum = new AlbumModel({
    id: 0,
    title: 'Loading album name...',
    year: 0,
    artist: 'Loading artist name...',
    artwork: 'loading',
    tracks_count: 0,
    tracks_duration: 0,
    album: false,
    tracks: null,
    artwork_color: '#000000'
});
