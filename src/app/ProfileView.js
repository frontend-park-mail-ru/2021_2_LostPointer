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
        navigateTo('/signin');
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
                  avatar: response.body.small_avatar,
                }),
                player: new PlayerComponent(),
                profileform: new Profile(response.body),
              };

              Object.values(this.data).forEach((component) => { component.render(); });

              this.isLoaded = true;
              this.template = Handlebars.templates['profileview.hbs'](this.data);
              this.render();
              document.addEventListener('click', this._logout.bind(this));
              const form = document.querySelector('.profile-form');
              form.addEventListener('submit', this.submitChangeProfileForm);
            });
        }
      });
  }

  submitChangeProfileForm(event) {
    event.preventDefault();

    const nameInput = event.target.querySelector('input[name="name"]');
    const emailInput = event.target.querySelector('input[name="email"]');
    const oldPasswordInput = event.target.querySelector('input[name="old_password"]');
    const passwordInput = event.target.querySelector('input[name="password"]');

    const msg = event.target.querySelector('.profile-form__msg');

    const formdata = new FormData();
    formdata.append('nickname', nameInput.value);
    formdata.append('email', emailInput.value);

    if (oldPasswordInput.value && passwordInput.value) {
      formdata.append('old_password', oldPasswordInput.value);
      formdata.append('new_password', passwordInput.value);
    }

    Request.patch(
      '/user/settings',
      formdata,
    )
      .then(({ status, body }) => {
        if (status === 200) {
          msg.classList.remove('fail');
          msg.innerText = 'Changed successfully';
          msg.classList.add('success', 'visible');
        } else {
          msg.classList.remove('success');
          msg.innerText = body.message;
          msg.classList.add('fail', 'visible');
        }
      })
      .catch(() => {
        msg.classList.remove('success');
        msg.innerText = 'Profile changing failed';
        msg.classList.add('fail', 'visible');
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
