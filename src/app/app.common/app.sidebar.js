import { Component } from '../../framework/core/component.js';

class AppSidebar extends Component {
  constructor(props) {
    super(props);
    this.selector = 'sidebar';
    this.template = `
  <img class="sidebar__logo" data-link href="/" src="/src/static/img/sidebar_logo.png">
  <object class="sidebar__icon" data="/src/static/img/home.svg"></object>
  <object class="sidebar__icon" data="/src/static/img/explore.svg"></object>
  <object class="sidebar__icon" data="/src/static/img/favorite.svg"></object>
  <object class="sidebar__icon" data="/src/static/img/more.svg"></object>
  `;
  }
}

export const appSidebar = new AppSidebar();