import { Component } from '../../managers/component';

const SidebarTemplate = require('./sidebar.hbs');

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.template = SidebarTemplate;
    }
}

export { Sidebar };
