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
                  avatar: response.body.avatar_small,
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
              const fileInput = document.querySelector('input[name="file"]');
              fileInput.addEventListener('change', this.uploadAvatarFile.bind(this));
            });
        }
      });
  }

  uploadAvatarFile(event) {
    const file = event.target.files[0];

    const formdata = new FormData();
    formdata.append('avatar', file, file.name);

    const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    if (ext === 'gif' || ext === 'png' || ext === 'jpeg' || ext === 'jpg' || ext === 'webp') {
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        const avatar = document.querySelector('.profile-avatar__img');
        avatar.setAttribute('src', e.target.result);
      });
      reader.readAsDataURL(file);
    } else {
      // TODO set fail msg
      return;
    }

    Request.patch(
      '/user/settings',
      formdata,
    )
      .then(({ status }) => {
        if (status === 200) {
          // говённо, это надо будет делать через медиатор событий, когда сделаем архитектуру
          Request.get('/user/settings')
            .then((response) => {
              this.data.topbar.data.avatar = response.body.avatar_small;
              this.data.topbar.update();
            });
        } else {
          // TODO set fail msg
        }
      })
      .catch(() => {
        // TODO set fail msg
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
