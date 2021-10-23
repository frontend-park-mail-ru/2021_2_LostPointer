import { Component } from '../component/component';

import SidebarTemplate from './sidebar.hbs';

class Sidebar extends Component<null> {
    render() {
        return SidebarTemplate();
    }
}

export { Sidebar };
