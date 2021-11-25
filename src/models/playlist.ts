import { Model } from 'models/model';
import { TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';
import Request, {IResponseBody} from 'services/request/request';
import { ContentType } from 'services/request/requestUtils';

export const DEFAULT_ARTWORK = '/static/playlists/default_playlist_artwork_384px.webp';

export interface IPlaylistModel {
    id: number;
    title: string;
    tracks: Array<TrackModel>;
    artwork: string;
    artwork_color: string;
    is_public: boolean;
    is_own: boolean;
}

export class PlaylistModel extends Model<IPlaylistModel> {
    constructor(props: IPlaylistModel = null) {
        super(props);
    }

    static getPlaylist(playlistId: number): Promise<PlaylistModel> | Promise<null> {
        return new Promise<PlaylistModel>((res) => {
            Request.get(`/playlists/${playlistId}`)
                .then((response) => {
                    if (response.status) {
                        res(null);
                        return;
                    }

                    if (response.tracks) {
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
                    }
                    res(new PlaylistModel(response));
                });
        });
    }

    static getUserPlaylists(): Promise<Array<PlaylistModel>> {
        return new Promise<Array<PlaylistModel>>((res) => {
            Request.get('/playlists')
                .then((response) => {
                    if (!response.playlists) {
                        res([]);
                        return;
                    }

                    const playlists: Array<PlaylistModel> = response.playlists.reduce(
                        (acc, elem, index) => {
                            elem.pos = index;
                            acc.push(new PlaylistModel(elem));
                            return acc;
                        },
                        []
                    );
                    res(playlists);
                });
        });
    }

    static createPlaylist(title: string): Promise<IPlaylistModel> {
        const formdata = new FormData();
        formdata.append('title', title);

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

    static removePlaylist(playlistId: number): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.delete(
                `/playlists/${playlistId}`,
            ).then((body) => {
                res(body);
            });
        });
    }

    updateInformation(
        title?: string,
        is_public?: boolean,
        artwork?: any,
    ): Promise<IResponseBody> | Promise<IPlaylistModel> {
        const formdata = new FormData();
        if (title != null) {
            formdata.append('title', title);
        }
        if (is_public != null) {
            formdata.append('is_public', is_public.toString());
        }
        if (artwork != null) {
            formdata.append('artwork', artwork, artwork.name);
        }

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
                            // при успехе ответ возвращает только artwork
                            if (body.artwork_color || body.artwork_color == '') {
                                if (title != null) {
                                    this.props.title = title;
                                }
                                if (is_public != null) {
                                    this.props.is_public = is_public;
                                }
                            }
                            res(body);
                        });
                    }
                });
        });
    }

    deleteAvatar(): Promise<IResponseBody> | Promise<IPlaylistModel> {
        return new Promise<IResponseBody>((res) => {
            const formdata = new FormData();
            formdata.append('id', String(this.props.id));

            Request.delete(
                `/playlist/artwork`,
                formdata,
                ContentType.FORM,
            ).then((body) => {
                // при успехе ответ возвращает только artwork
                if (body.artwork_color ) {
                    this.props.artwork = DEFAULT_ARTWORK;
                }
                res(body);
            });
        });
    }
}
