import { Model } from 'models/model';
import Request from 'services/request/request';
import { AlbumModel } from 'models/album';
import { ArtistModel } from 'models/artist';

export interface ITrackModel {
    id: number;
    title: string;
    artist: ArtistModel;
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
                    const emptyArtist = new ArtistModel({
                        id: 0,
                        name: 'Loading artist name...',
                        avatar: 'loading',
                        video: '',
                        albums: [],
                        tracks: [],
                    });

                    const emptyAlbum = new AlbumModel({
                        id: 0,
                        title: 'Loading album name...',
                        year: 0,
                        artist: 'Loading artist name...',
                        artwork: 'loading',
                        tracksCount: 0,
                        tracksDuration: 0,
                    });

                    const emptyTrack = new TrackModel({
                        id: 0,
                        title: 'Loading title...',
                        artist: emptyArtist,
                        album: emptyAlbum,
                        explicit: false,
                        genre: '',
                        number: 0,
                        file: '',
                        listenCount: 0,
                        duration: 0,
                        lossless: false,
                        cover: '',
                        pos: 0,
                    })

                    res(Array.from({length: 3}, () => emptyTrack));
                });
        });
    }
}
