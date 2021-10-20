import { Component } from 'managers/component';

const TopBarTemplate = require('./topbar.hbs');

class TopBar extends Component {
    render() {
        return TopBarTemplate;
    }
}

export { TopBar };
