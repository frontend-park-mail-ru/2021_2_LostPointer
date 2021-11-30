import { Component } from '../Component/component';

import SidebarTemplate from './sidebar.hbs';
import './sidebar.scss';

export class Sidebar extends Component<null> {
    render() {
        return SidebarTemplate();
    }
}

export default new Sidebar();
