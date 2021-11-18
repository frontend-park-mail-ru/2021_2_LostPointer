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

    static getPlaylist(playlistId: string): Promise<PlaylistModel> | Promise<null> {
        return new Promise<PlaylistModel>((res) => {
            Request.get(`/playlists/${playlistId}`)
                .then((response) => {
                    // FIXME костыль, потому что бэк не возвращает id
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
                            acc.push(new PlaylistModel(elem));
                            return acc;
                        },
                        []
                    );
                    res(playlists);
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
