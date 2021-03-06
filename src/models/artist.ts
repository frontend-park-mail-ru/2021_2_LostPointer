import { Model } from 'models/model';
import Request from 'services/request/request';
import { mockTrack, TrackModel } from 'models/track';
import { AlbumModel, mockAlbum } from 'models/album';

export interface IArtistModel {
    id: number;
    name: string;
    avatar?: string;
    video?: string;
    albums?: Array<AlbumModel>;
    tracks?: Array<TrackModel>;
}

export class ArtistModel extends Model<IArtistModel> {
    constructor(props: IArtistModel = null) {
        super(props);
    }

    static getHomepageArtists(): Promise<ArtistModel[]> | Promise<[]> {
        return new Promise<ArtistModel[]>((res) => {
            Request.get('/home/artists')
                .then((response) => {
                    if (response && response.status === 500) {
                        res([]);
                    }
                    sessionStorage.setItem(
                        '/home/artists',
                        JSON.stringify(response)
                    );
                    const artists: Array<ArtistModel> = response
                        ? response.reduce((acc, elem) => {
                              acc.push(new ArtistModel(elem));
                              return acc;
                          }, [])
                        : [];
                    res(artists);
                })
                .catch(() => {
                    const response = JSON.parse(
                        sessionStorage.getItem('/home/artists')
                    );
                    if (response) {
                        if (response.status === 500) {
                            res([]);
                        }
                        const artists: Array<ArtistModel> = response
                            ? response.reduce((acc, elem) => {
                                  acc.push(new ArtistModel(elem));
                                  return acc;
                              }, [])
                            : [];
                        res(artists);
                    } else {
                        res(Array.from({ length: 4 }, () => mockArtist));
                    }
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

                    response.tracks = response
                        ? TrackModel.serializeList(response.tracks)
                        : [];
                    response.albums = response
                        ? response.albums.reduce((acc, elem, index) => {
                              elem.pos = index;
                              acc.push(new AlbumModel(elem));
                              return acc;
                          }, [])
                        : [];
                    res(new ArtistModel(response));
                })
                .catch(() => {
                    const emptyArtist = mockArtist;
                    emptyArtist.props.albums = Array.from(
                        { length: 4 },
                        () => mockAlbum
                    );
                    emptyArtist.props.tracks = Array.from(
                        { length: 4 },
                        () => mockTrack
                    );
                    res(emptyArtist);
                });
        });
    }
}

export const mockArtist = new ArtistModel({
    id: 0,
    name: 'Loading artist name...',
    avatar: 'loading',
    video: '',
    albums: [],
    tracks: [],
});
