import { Model } from 'models/model';
import Request from 'services/request/request';
import {TrackModel} from 'models/track';
import {AlbumModel} from 'models/album';

export interface IArtistModel {
    id: number;
    name: string;
    avatar: string;
    video: string;
    albums: Array<AlbumModel>;
    tracks: Array<TrackModel>;
}

export class ArtistModel extends Model<IArtistModel> {
    constructor(props: IArtistModel = null) {
        super(props);
    }

    static getHomepageArtists(): Promise<ArtistModel[]> | Promise<[]> {
        return new Promise<ArtistModel[]>((res) => {
            Request.get('/home/artists')
                .then((response) => {
                    const artists: Array<ArtistModel> = response.reduce(
                        (acc, elem) => {
                            acc.push(new ArtistModel(elem));
                            return acc;
                        },
                        []
                    );
                    res(artists);
                })
                .catch(() => {
                    const emptyArtist = new ArtistModel({
                        id: 0,
                        name: 'Loading artist name...',
                        avatar: 'loading',
                        video: '',
                        albums: [],
                        tracks: [],
                    });

                    res(Array.from({length: 4}, () => emptyArtist));
                });
        });
    }

    static getArtist(artistId: string): Promise<ArtistModel> | Promise<null> {
        return new Promise<ArtistModel>((res) => {
            Request.get(`/artist/${artistId}`)
                .then((response) => {
                    if ('status' in response && response.status !== 200) {
                        return res(null);
                    }

                    response.tracks = response.tracks.reduce(
                        (acc, elem, index) => {
                            elem.pos = index;
                            const album = new AlbumModel(elem.album);
                            elem.album = album;
                            acc.push(new TrackModel(elem));
                            return acc;
                        },
                        []
                    );
                    response.albums = response.albums.reduce(
                        (acc, elem, index) => {
                            elem.pos = index;
                            acc.push(new AlbumModel(elem));
                            return acc;
                        },
                        []
                    );
                    res(new ArtistModel(response));
                });
        });
    }
}
