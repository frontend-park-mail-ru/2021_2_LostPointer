import {Model} from 'models/model';
import Request, {IResponseBody} from 'services/request/request';
import {ContentType} from 'services/request/requestUtils';

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

    updateSettings(formdata: FormData): Promise<IResponseBody> {
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
                            if (body.status === 200) {
                                this.props.nickname = String(formdata.get('nickname'));
                                this.props.email = String(formdata.get('email'));
                            }
                            res(body);
                        })
                    }
                })
        })
    }
}
