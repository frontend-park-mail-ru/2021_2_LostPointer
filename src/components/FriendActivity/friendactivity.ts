import { Component } from 'components/Component/component';

import FriendActivityTemplate from './friendactivity.hbs';

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
