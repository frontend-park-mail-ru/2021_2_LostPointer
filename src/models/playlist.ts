import { Model } from 'models/model';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import Request, {IResponseBody} from 'services/request/request';
import { ContentType } from 'services/request/requestUtils';


export interface IPlaylistModel {
    id: number;
    title: string;
    tracks: Array<TrackModel>;
    artwork: string,
}

export class PlaylistModel extends Model<IPlaylistModel> {
    constructor(props: IPlaylistModel = null) {
        super(props);
    }

    static getPlaylist(playlistId: number): Promise<PlaylistModel> | Promise<null> {
        return new Promise<PlaylistModel>((res) => {
            Request.get(`/playlists/${playlistId}`)
                .then((response) => {
                    // FIXME костыль - потому что бэк не возвращает id
                    response.id = playlistId;
                    response.tracks = response.tracks.reduce(
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
                    res(new PlaylistModel(response));
                });
        });
    }

    static getUserPlaylists(): Promise<Array<PlaylistModel>> {
        return new Promise<Array<PlaylistModel>>((res) => {
            Request.get('/playlists')
                .then((response) => {
                    const playlists: Array<PlaylistModel> = response.playlists.reduce(
                        (acc, elem, index) => {
                            elem.pos = index;
                            // FIXME костыль - потому что бэк может возвращать айдишник в поле playlist_id
                            if (!elem.id) {
                                elem.id = elem.playlist_id;
                            }
                            acc.push(new PlaylistModel(elem));
                            return acc;
                        },
                        []
                    );
                    res(playlists);
                });
        });
    }

    static createPlaylist(formdata: FormData): Promise<IPlaylistModel> {
        return new Promise<IPlaylistModel>((res) => {
           Request.post(
               '/playlists',
               formdata,
               ContentType.FORM,
           ).then((playlist) => {
               res(playlist);
           })
        });
    }

    static addTrack(playlistId: number, trackId: number): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.post(
                '/playlist/track',
                JSON.stringify({
                    playlist_id: playlistId,
                    track_id: trackId,
                }),
                ContentType.JSON,
            ).then((body) => {
                res(body);
            });
        });
    }

    static removeTrack(playlistId: number, trackId: number): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.delete(
                '/playlist/track',
                JSON.stringify({
                    playlist_id: playlistId,
                    track_id: trackId,
                }),
                ContentType.JSON,
            ).then((body) => {
                res(body);
            });
        });
    }

    updateInformation(formdata: FormData): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.get(
                '/csrf',
            )
                .then((csrfBody) => {
                    if (csrfBody.status === 200) {
                        const csrfToken = csrfBody.message;
                        Request.patch(
                            `/playlists/${this.getProps().id}`,
                            formdata,
                            ContentType.FORM,
                            {
                                'X-CSRF-Token': csrfToken,
                            },
                        ).then((body) => {
                            if (body.status === 200) {
                                this.props.title = String(formdata.get('title'));
                            }
                            res(body);
                        })
                    }
                });
        });
    }
}
