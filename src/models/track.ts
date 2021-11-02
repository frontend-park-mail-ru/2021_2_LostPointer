import { Model } from 'models/model';
import Request from 'services/request/request';
import { AlbumModel } from 'models/album';
import { ArtistModel } from 'models/artist';

export interface ITrackModel {
    id: number;
    title: string;
    artist: string;
    album: AlbumModel;
    explicit: boolean;
    genre: string;
    number: number;
    file: string;
    listenCount: number;
    duration: number;
    lossless: boolean;
    cover: string;
    pos: number;
}

export class TrackModel extends Model<ITrackModel> {
    constructor(props: ITrackModel = null) {
        super(props);
    }

    static getHomepageTracks(): Promise<TrackModel[]> | Promise<[]> {
        return new Promise((res) => {
            Request.get('/home/tracks')
                .then((response) => {
                    const tracks: Array<TrackModel> = response.reduce(
                        (acc, elem, index) => {
                            elem.pos = index;
                            const artist = new ArtistModel(elem.artist);
                            const album = new AlbumModel(elem.album);
                            elem.album = album;
                            elem.artist = artist;
                            acc.push(new TrackModel(elem));
                            return acc;
                        },
                        []
                    );
                    res(tracks);
                })
                .catch(() => {
                    res([]);
                });
        });
    }
}
