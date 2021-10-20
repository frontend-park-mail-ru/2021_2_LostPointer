import { Component } from '../../managers/component';
import { TProps } from '../../interfaces'

const SidebarTemplate = require('./sidebar.hbs');

class Sidebar extends Component {
    render() {
        return SidebarTemplate();
    }
}

export { Sidebar };
