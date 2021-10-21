import { Component } from '../component/component';

const SidebarTemplate = require('./sidebar.hbs');

class Sidebar extends Component {
    render() {
        return SidebarTemplate();
    }
}

export { Sidebar };
