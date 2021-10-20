import { Component } from '../../managers/component';

const FriendActivityTemplate = require('./friendactivity.hbs');

class FriendActivity extends Component {
    constructor(config) {
        super(config);
        this.data = {
            friends: [
                {
                    img: 'bc17edcb-4dc4-46cf-9ae9-412cb6bd6955',
                    nickname: 'Frank Sinatra',
                    listening_to: 'Strangers in the Night',
                },
                {
                    img: 'e4596b4e-b908-4b33-a788-d68477bc996c',
                    nickname: 'Земфира',
                    listening_to: 'Трафик',
                },
            ],
        };
        this.template = FriendActivityTemplate;
    }
}

export { FriendActivity };
