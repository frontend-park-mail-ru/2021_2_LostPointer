import {Model} from 'models/model';
import Request, {IResponseBody} from 'services/request/request';
import {ContentType} from "services/request/requestUtils";

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

    static getUserSettings(): Promise<UserModel> {
        return new Promise<UserModel>((res) => {
            Request.get('/user/settings')
                .then((response) => {
                    res(response);
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
                            return res(body);
                        })
                    }
                })
        })
    }
}
