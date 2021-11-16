import { Component } from 'components/Component/component';

import { ButtonComponent } from 'lostpointer-storybook';

import FriendActivityTemplate from './friendactivity.hbs';
import './friendactivity.scss';

interface IFriendActivityProps {
    friends: Array<any>; //TODO
}

export class FriendActivity extends Component<IFriendActivityProps> {
    private button: string;

    constructor(config) {
        super(config);
        this.button = new ButtonComponent({
            label: 'View All',
            size: 'regular',
            mode: 'secondary',
        }).render();
    }

    render() {
        return FriendActivityTemplate({
            friends: this.props.friends,
            button: this.button,
        });
    }
}
