import { Component } from 'components/component/component';

const TopBarTemplate = require('./topbar.hbs');

class TopBar extends Component {
    render() {
        return TopBarTemplate;
    }
}

export { TopBar };
