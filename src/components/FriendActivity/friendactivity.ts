import { Component } from 'components/Component/component';

import FriendActivityTemplate from './friendactivity.hbs';
import './friendactivity.scss'

interface IFriendActivityProps {
    friends: Array<any>; //TODO
}

export class FriendActivity extends Component<IFriendActivityProps> {
    constructor(config) {
        super(config);
    }

    render() {
        return FriendActivityTemplate({ friends: this.props.friends });
    }
}
