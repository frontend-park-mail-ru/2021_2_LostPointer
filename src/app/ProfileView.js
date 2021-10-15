import { PlayerComponent } from './common/PlayerComponent.js';
import { Sidebar } from './common/Sidebar.js';
import { TopBar } from './common/TopBar.js';
import Request from '../framework/appApi/request.js';
import { logout } from './common/utils.js';
import { Component } from '../framework/core/component.js';
import { Profile } from './common/Profile.js';
// eslint-disable-next-line import/no-cycle
import { navigateTo } from '../framework/core/router.js';

export class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.isLoaded = false;
  }

  _logout(event) {
    if (event.target.className === 'topbar-auth' && event.target.dataset.action === 'logout') {
      logout().then(() => {
        this.data.topbar.data.authenticated = false;
        this.data.topbar.update();
      });
    }
  }

  didMount() {
    Request.get(
      '/auth',
    )
      .then(({ status }) => {
        this.authenticated = status === 200;
      })
      .then(() => {
        if (!this.authenticated) {
          navigateTo('/signin');
        } else {
          Request.get('/user/settings')
            .then((response) => {
              this.data = {
                sidebar: new Sidebar(),
                topbar: new TopBar({
                  authenticated: this.authenticated,
                  avatar: response.body.avatar,
                }),
                player: new PlayerComponent(),
                profileform: new Profile({
                  nickname: response.body.nickname,
                  email: response.body.email,
                  avatar: response.body.avatar,
                }),
              };

              Object.values(this.data).forEach((component) => { component.render(); });

              this.isLoaded = true;
              this.template = Handlebars.templates['profileview.hbs'](this.data);
              this.render();
              document.addEventListener('click', this._logout.bind(this));
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
