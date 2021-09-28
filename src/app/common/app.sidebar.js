import { FWComponent } from '../../framework/index.js';

class AppSidebar extends FWComponent {
}

export const appSidebar = new AppSidebar({
  selector: 'sidebar',
  template: `
  <img class="sidebar__logo" data-link href="/" src="/src/static/img/sidebar_logo.png">
  <object class="sidebar__icon" data="/src/static/img/home.svg"></object>
  <object class="sidebar__icon" data="/src/static/img/explore.svg"></object>
  <object class="sidebar__icon" data="/src/static/img/favorite.svg"></object>
  <object class="sidebar__icon" data="/src/static/img/more.svg"></object>
  `,
});
