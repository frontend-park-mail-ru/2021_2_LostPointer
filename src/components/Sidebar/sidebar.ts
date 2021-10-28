import { Component } from '../Component/component';

import SidebarTemplate from './sidebar.hbs';

export class Sidebar extends Component<null> {
    render() {
        return SidebarTemplate();
    }
}

