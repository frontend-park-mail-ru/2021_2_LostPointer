import { Model } from 'models/model';
import Request from 'services/request/request';
import {TrackModel} from 'models/track';
import {AlbumModel} from 'models/album';

export interface IArtistModel {
    id: number;
    name: string;
    avatar: string;
    video: string;
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
                    res([]);
                });
        });
    }

    static getArtist(artistId: string): Promise<ArtistModel> {
        return new Promise<ArtistModel>((res) => {
            Request.get(`/artist/${artistId}`)
                .then((response) => {
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
                    res(new ArtistModel(response));
                });
        });
    }
}
