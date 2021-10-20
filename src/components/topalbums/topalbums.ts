import { Component } from 'managers/component';

const TopAlbumsTemplate = require('./topalbums.hbs');

interface ITopAlbumsProps {
    albums: Array<any>
}

class TopAlbums extends Component<ITopAlbumsProps> {
    constructor(props) {
        super(props);
    }
    render() {
        return TopAlbumsTemplate({albums: this.props.albums});
    }
}

export { TopAlbums };
