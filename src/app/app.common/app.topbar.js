import { Component } from '../../framework/core/component.js';

class AppTopbar extends Component {
  constructor(props) {
    super(props);
    this.template = `
    <div class="topbar">
        <span class="topbar__search"></span>
        <span class="topbar-icons">
            <img class="topbar-icon" src="/src/static/img/notifications-none.svg">
            <img class="topbar-icon" src="/src/static/img/settings.svg">
        </span>
        <img class="topbar-profile" href="/signin" data-link src="/src/static/img/{{ avatar_img }}">
    </div>
  `;
    this.data = {
      avatar_img: 'ava.png',
    };
  }
}

export const appTopbar = new AppTopbar();
