import { Component } from 'managers/component';

const TopAlbumsTemplate = require('./topalbums.hbs');

class TopAlbums extends Component {
    constructor(props) {
        super(props);
        this.template = TopAlbumsTemplate;
    }
}

export { TopAlbums };
