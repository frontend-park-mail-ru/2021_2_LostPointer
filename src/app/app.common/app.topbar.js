import { FWComponent } from '../../framework/index.js';

class AppTopbar extends FWComponent {
  constructor(props) {
    super(props);
    this.selector = 'topbar';
    this.template = `
  <span class="topbar__search"></span>
  <span class="topbar-icons">
    <img class="topbar-icon" src="/src/static/img/notifications-none.svg">
    <img class="topbar-icon" src="/src/static/img/settings.svg">
    </span>
  <img class="topbar-profile" href="/signin" data-link src="/src/static/img/{{ avatar_img }}">
  `;
    this.data = {
      avatar_img: 'ava.png',
    };
  }
}

export const appTopbar = new AppTopbar();
