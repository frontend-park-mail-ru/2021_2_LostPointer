import {Model} from 'models/model';
import Request, {IResponseBody} from 'services/request/request';
import {ContentType} from 'services/request/requestUtils';
import { mockTrack, TrackModel } from 'models/track';
import { ArtistModel } from 'models/artist';
import { AlbumModel } from 'models/album';

export interface IAuthResponse {
    authenticated: boolean;
    avatar: string;
}

export interface IUserModel {
    email: string;
    nickname: string;
    small_avatar: string;
    big_avatar: string;
}

export class UserModel extends Model<IUserModel> {
    constructor(props: IUserModel = null) {
        super(props);
    }

    static signup(payload: object): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.post(
                '/user/signup',
                JSON.stringify(payload),
                ContentType.JSON
            ).then((body) => {
                res(body);
            })
        });
    }

    static signin(payload: object): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.post(
                '/user/signin',
                JSON.stringify(payload),
                ContentType.JSON
            ).then((body) => {
                res(body);
            })
        });
    }

    static auth(): Promise<IAuthResponse> {
        return new Promise<IAuthResponse>((res) => {
            Request.get('/auth')
                .then((body) => {
                    res({
                        authenticated: body.status === 200,
                        avatar: body.avatar ? body.avatar : null,
                    });
                })
                .catch(() => {
                    res({
                        authenticated: false,
                        avatar: '/static/img/default_avatar_150px.webp',
                    })
                })
        })
    }

    static getSettings(): Promise<UserModel> {
        return new Promise<UserModel>((res) => {
            Request.get('/user/settings')
                .then((body) => {
                    res(new UserModel(body));
                });
        })
    }

    static getFavorites(): Promise<Array<TrackModel>> {
        return new Promise<Array<TrackModel>>((res) => {
            Request.get('/track/favorites')
                .then((response) => {
                    if (response.status) {
                        res([]);
                        return;
                    }

                    res(response.reduce(
                        // TODO повторяющийся код получения Array<TrackModel> из ответа бэкенда - вынести
                        (acc, elem, index) => {
                            elem.pos = index;
                            const artist = new ArtistModel(elem.artist);
                            const album = new AlbumModel(elem.album);
                            elem.album = album;
                            elem.artist = artist;
                            elem.artwork_color = album.props.artwork_color;
                            acc.push(new TrackModel(elem));
                            return acc;
                        },
                        [],
                    ))
                })
                .catch(() => {
                    res(Array.from({ length: 4 }, () => mockTrack));
                })
        })
    }

    static logout(): Promise<IResponseBody> {
        return new Promise<IResponseBody>((res) => {
            Request.post('/user/logout').then((body) => {
                res(body);
            });
        })
    }

    updateSettings(
        nickname?: string,
        email?: string,
        old_password?: string,
        new_password?: string,
        avatar?: any,
        ): Promise<IResponseBody> {

        const formdata = new FormData();
        if (nickname && email) {
            formdata.append('nickname', nickname);
            formdata.append('email', email);
        }
        if (old_password && new_password ) {
            formdata.append('old_password', old_password);
            formdata.append('new_password', new_password);
        }
        if (avatar) {
            formdata.append('avatar', avatar, avatar.name);
        }

        return new Promise<IResponseBody>((res) => {
            Request.get(
                '/csrf',
            )
                .then((csrfBody) => {
                    if (csrfBody.status === 200) {
                        const csrfToken = csrfBody.message;
                        Request.patch(
                            '/user/settings',
                            formdata,
                            ContentType.FORM,
                            {
                                'X-CSRF-Token': csrfToken,
                            },
                        ).then((body) => {
                            if (body.status === 200 && nickname && email) {
                                this.props.nickname = nickname;
                                this.props.email = email;
                            }
                            res(body);
                        })
                    }
                })
        })
    }
}
