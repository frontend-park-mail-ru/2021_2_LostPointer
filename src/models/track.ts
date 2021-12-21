import { Model } from 'models/model';
import Request, { IResponseBody } from 'services/request/request';
import { AlbumModel, mockAlbum } from 'models/album';
import { ArtistModel, mockArtist } from 'models/artist';

export interface ITrackModel {
    id: number;
    title: string;
    artist: ArtistModel;
    album: AlbumModel;
    explicit: boolean;
    genre: string;
    number: number;
    file: string;
    listen_count: number;
    duration: number;
    lossless: boolean;
    cover: string;
    pos: number;
    is_in_favorites: boolean;
}

export class TrackModel extends Model<ITrackModel> {
    constructor(props: ITrackModel = null) {
        super(props);
    }

    static getHomepageTracks(): Promise<TrackModel[]> | Promise<[]> {
        return new Promise((res) => {
            Request.get('/home/tracks')
                .then((response) => {
                    if (response && response.status === 500) {
                        res([]);
                    }
                    sessionStorage.setItem(
                        '/home/tracks',
                        JSON.stringify(response)
                    );
                    const tracks: Array<TrackModel> = response
                        ? TrackModel.serializeList(response)
                        : [];
                    res(tracks);
                })
                .catch(() => {
                    const response = JSON.parse(
                        sessionStorage.getItem('/home/tracks')
                    );
                    if (response) {
                        const tracks: Array<TrackModel> = response
                            ? TrackModel.serializeList(response)
                            : [];
                        res(tracks);
                    } else {
                        res(Array.from({ length: 3 }, () => mockTrack));
                    }
                });
        });
    }

    static getAlbumTracks(id: string): Promise<TrackModel[]> | Promise<[]> {
        return new Promise((resolve) => {
            Request.get(`/album/${id}`).then((response) => {
                const tracks = response
                    ? TrackModel.serializeList(
                          response.tracks,
                          response,
                          response.artist
                      )
                    : [];
                resolve(tracks);
            });
        });
    }

    static addInFavorites(id: number): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.post(`/track/like/${id}`).then((response) => {
                res(response);
            });
        });
    }

    static removeFromFavorites(id: number): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.delete(`/track/like/${id}`).then((response) => {
                res(response);
            });
        });
    }

    static serializeList(trackList, album = null, artist = null) {
        return trackList.reduce((acc, elem, index) => {
            elem.pos = index;
            elem.album = new AlbumModel(album ? album : elem.album);
            elem.artist = new ArtistModel(artist ? artist : elem.artist);
            elem.artwork_color = elem.album.props.artwork_color;
            acc.push(new TrackModel(elem));
            return acc;
        }, []);
    }
}

export const mockTrack = new TrackModel({
    id: 0,
    title: 'Loading title...',
    artist: mockArtist,
    album: mockAlbum,
    explicit: false,
    genre: '',
    number: 0,
    file: '',
    listen_count: 0,
    duration: 0,
    lossless: false,
    cover: '',
    pos: 0,
    is_in_favorites: false,
});
