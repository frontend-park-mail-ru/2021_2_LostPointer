import { Component } from 'managers/component';

const FriendActivityTemplate = require('./friendactivity.hbs');

interface IFriendActivityProps{
    friends: Array<any>,
}

class FriendActivity extends Component<IFriendActivityProps> {
    constructor(config) {
        super(config);
        console.log(this.props);
    }

    render(): HTMLCollection {
        console.log(FriendActivityTemplate({ friends: this.props.friends }));
        return FriendActivityTemplate({ friends: this.props.friends });
    }
}

export { FriendActivity };
