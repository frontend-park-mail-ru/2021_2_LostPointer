import { Model } from 'models/model';
import Request from 'services/request/request';
import { AlbumModel } from 'models/album';
import { ArtistModel } from 'models/artist';
import mockArtist from 'models/mocks/mockArtist';
import mockAlbum from 'models/mocks/mockAlbum';
import mockTrack from 'models/mocks/mockTrack';

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
                        ? response.reduce((acc, elem, index) => {
                              elem.pos = index;
                              const artist = new ArtistModel(elem.artist);
                              const album = new AlbumModel(elem.album);
                              elem.album = album;
                              elem.artist = artist;
                              acc.push(new TrackModel(elem));
                              return acc;
                          }, [])
                        : [];
                    res(tracks);
                })
                .catch(() => {
                    const response = JSON.parse(
                        sessionStorage.getItem('/home/tracks')
                    );
                    if (response) {
                        const tracks: Array<TrackModel> = response
                            ? response.reduce((acc, elem, index) => {
                                  elem.pos = index;
                                  const artist = new ArtistModel(elem.artist);
                                  const album = new AlbumModel(elem.album);
                                  elem.album = album;
                                  elem.artist = artist;
                                  acc.push(new TrackModel(elem));
                                  return acc;
                              }, [])
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
                    ? response.tracks.reduce((acc, elem, idx) => {
                          elem.pos = idx;
                          elem.album = new AlbumModel(response);
                          elem.artist = new ArtistModel(response.artist);
                          const track = new TrackModel(elem);
                          acc.push(track);
                          return acc;
                      }, [])
                    : [];
                resolve(tracks);
            });
        });
    }
}
