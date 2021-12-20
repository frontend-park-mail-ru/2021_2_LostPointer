import { Component } from '../Component/component';

import SidebarTemplate from './sidebar.hbs';
import './sidebar.scss';

export class Sidebar extends Component<null> {
    render() {
        return SidebarTemplate();
    }

    updateHomeLink(enable: boolean) {
        const img = document.querySelector('.js-main-link-icon');
        if (!img) {
            return;
        }
        if (enable) {
            (<HTMLImageElement>img).src = '/static/img/home_light.svg';
        } else {
            (<HTMLImageElement>img).src = '/static/img/home.svg';
        }
    }

    updateFavLink(enable: boolean) {
        const img = document.querySelector('.js-fav-link-icon');
        if (!img) {
            return;
        }
        if (enable) {
            (<HTMLImageElement>img).src = '/static/img/favorite_light.svg';
        } else {
            (<HTMLImageElement>img).src = '/static/img/favorite.svg';
        }
    }
}

export default new Sidebar();
