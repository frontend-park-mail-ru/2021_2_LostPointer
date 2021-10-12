import { PlayerComponent } from './common/PlayerComponent.js';
import { Sidebar } from './common/Sidebar.js';
import { TopBar } from './common/TopBar.js';
import Request from '../framework/appApi/request.js';
import { logout } from './common/utils.js';
import { Component } from '../framework/core/component.js';
import { Profile } from './common/Profile.js';

export class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.isLoaded = false;
  }

  didMount() {
    Request.get(
      '/auth',
    )
      .then(({ status }) => { this.authenticated = status === 200; })
      .catch((error) => console.log(error.msg));

    this.data = {
      sidebar: new Sidebar(),
      topbar: new TopBar({ authenticated: this.authenticated }),
      player: new PlayerComponent(),
      profileform: new Profile(),
    };

    Object.values(this.data).forEach((component) => { component.render(); });

    this.isLoaded = true;
    this.template = Handlebars.templates['profileview.hbs'](this.data);
    this.render();
    const that = this;
    document.addEventListener('click', (e) => {
      if (e.target.className === 'topbar-auth' && e.target.dataset.action === 'logout') {
        logout().then(() => {
          that.data.topbar.data.authenticated = false;
          that.data.topbar.update();
        });
      }
    });
  }

  render() {
    if (!this.isLoaded) {
      this.didMount();
    } else {
      super.render();
    }
  }
}
