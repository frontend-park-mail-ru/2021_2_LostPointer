import { Component } from 'components/component/component';

const FriendActivityTemplate = require('./friendactivity.hbs');

interface IFriendActivityProps{
    friends: Array<any>,
}

class FriendActivity extends Component<IFriendActivityProps> {
    constructor(config) {
        super(config);
    }

    render() {
        return FriendActivityTemplate({ friends: this.props.friends });
    }
}

export { FriendActivity };
