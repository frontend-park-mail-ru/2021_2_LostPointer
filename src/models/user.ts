import {Model} from 'models/model';
import Request, {IResponseBody} from 'services/request/request';
import {ContentType} from "services/request/requestUtils";

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
    email: string;
    nickname: string;
    small_avatar: string;
    big_avatar: string;

    constructor(props: IUserModel = null) {
        super(props);
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
        this.nickname = String(formdata.get('nickname'));
        this.email = String(formdata.get('email'));

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
                            ContentType.JSON,
                            {
                                'X-CSRF-Token': csrfToken,
                            },
                        ).then((body) => {
                            res(body);
                        })
                    }
                })
        })
    }
}
