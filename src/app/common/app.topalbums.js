import { FWComponent } from '../../framework/index.js';

class AppTopAlbums extends FWComponent {
}

export const appTopAlbums = new AppTopAlbums({
  selector: 'listen-now__top-albums',
  template: `
  <span class="topbar__search"></span>
  <span class="topbar-icons">
    <img class="topbar-icon" src="/src/static/img/notifications-none.svg">
    <img class="topbar-icon" src="/src/static/img/settings.svg">
    </span>
  <img class="topbar-profile" href="/signin" data-link src="/src/static/img/ava.png">
  `,
});
