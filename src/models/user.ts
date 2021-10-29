import {Model} from 'models/model';
import Request from '../../src/services/request/request';

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
}
