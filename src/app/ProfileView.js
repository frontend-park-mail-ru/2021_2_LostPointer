import { PlayerComponent } from './common/PlayerComponent.js';
import { Sidebar } from './common/Sidebar.js';
import { TopBar } from './common/TopBar.js';
import Request from '../framework/appApi/request.js';
import { logout } from './common/utils.js';
import { Component } from '../framework/core/component.js';
import { Profile } from './common/Profile.js';
import router from '../framework/core/router.js';
import routerStore from '../framework/core/routerStore.js';
import { ContentType } from '../framework/appApi/requestUtils.js';
import { CustomValidation, isValidForm } from '../framework/validation/validation.js';
import {
  confirmPasswordValidityChecks,
  emailValidityChecks,
  nameValidityChecks,
  passwordValidityChecks, simplePasswordValidityChecks,
} from '../framework/validation/validityChecks.js';

export class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.isLoaded = false;
  }

  _logout(event) {
    if (event.target.className === 'topbar-auth' && event.target.dataset.action === 'logout') {
      logout().then(() => {
        router.go(routerStore.signin);
      });
    }
  }

  didMount() {
    Request.get(
      '/auth',
    )
      .then(({ body }) => {
        this.authenticated = body.status === 200;
      })
      .then(() => {
        if (!this.authenticated) {
          router.go(routerStore.signin);
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
              const nicknameInput = form.querySelector('input[name="nickname"]');
              const emailInput = form.querySelector('input[name="email"]');
              const invalidities = document.querySelector('.profile-form__invalidities');

              nicknameInput.CustomValidation = new CustomValidation(
                nameValidityChecks,
                invalidities,
              );
              emailInput.CustomValidation = new CustomValidation(emailValidityChecks, invalidities);

              form.addEventListener('submit', this.submitChangeProfileForm);
              const fileInput = document.querySelector('input[name="file"]');
              fileInput.addEventListener('change', this.uploadAvatarFile.bind(this));
            });
        }
      });
  }

  uploadAvatarFile(event) {
    const file = event.target.files[0];
    const msg = document.querySelector('.profile-avatar__msg');

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
      msg.classList.remove('success');
      msg.innerText = 'Invalid file';
      msg.classList.add('fail', 'visible');
      return;
    }

    Request.get(
      '/csrf',
    )
      .then((csrfResponse) => {
        if (csrfResponse.body.status === 200) {
          const csrfToken = csrfResponse.body.message;

          Request.patch(
            '/user/settings',
            formdata,
            ContentType.JSON,
            {
              'X-CSRF-Token': csrfToken,
            },
          )
            .then(({ body }) => {
              if (body.status === 200) {
                // говённо, это надо будет делать через медиатор событий, когда сделаем архитектуру
                Request.get('/user/settings')
                  .then((response) => {
                    this.data.topbar.data.avatar = response.body.avatar_small;
                    this.data.topbar.update();
                    msg.classList.remove('fail');
                    msg.innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');
                  });
              } else {
                msg.classList.remove('success');
                msg.innerText = body.message;
                msg.classList.add('fail', 'visible');
              }
            })
            .catch(() => {
              msg.classList.remove('success');
              msg.innerText = 'Avatar changing failed';
              msg.classList.add('fail', 'visible');
            });
        }
      });
  }

  submitChangeProfileForm(event) {
    event.preventDefault();

    const nicknameInput = event.target.querySelector('input[name="nickname"]');
    const emailInput = event.target.querySelector('input[name="email"]');
    const oldPasswordInput = event.target.querySelector('input[name="old_password"]');
    const passwordInput = event.target.querySelector('input[name="password"]');
    const confirmPasswordInput = event.target.querySelector('input[name="confirm_password"]');
    const invalidities = document.querySelector('.profile-form__invalidities');
    const msg = event.target.querySelector('.profile-form__msg');
    let requiredInputsNumber = 2;

    if (oldPasswordInput.value !== ''
      || passwordInput.value !== ''
      || confirmPasswordInput.value !== '') {
      oldPasswordInput.CustomValidation = new CustomValidation(
        simplePasswordValidityChecks, invalidities,
      );
      passwordInput.CustomValidation = new CustomValidation(
        passwordValidityChecks,
        invalidities,
      );
      confirmPasswordInput.CustomValidation = new CustomValidation(
        confirmPasswordValidityChecks, invalidities,
      );
      requiredInputsNumber = 5;
    } else {
      delete oldPasswordInput.CustomValidation;
      delete passwordInput.CustomValidation;
      delete confirmPasswordInput.CustomValidation;
    }

    invalidities.innerHTML = '';
    msg.innerHTML = '';
    if (!isValidForm(requiredInputsNumber)) {
      msg.classList.add('fail', 'visible');
      return;
    }

    const formdata = new FormData();
    formdata.append('nickname', nicknameInput.value);
    formdata.append('email', emailInput.value);

    if (oldPasswordInput.value && passwordInput.value) {
      formdata.append('old_password', oldPasswordInput.value);
      formdata.append('new_password', passwordInput.value);
    }

    Request.get(
      '/csrf',
    )
      .then((csrfResponse) => {
        if (csrfResponse.body.status === 200) {
          const csrfToken = csrfResponse.body.message;

          Request.patch(
            '/user/settings',
            formdata,
            ContentType.JSON,
            {
              'X-CSRF-Token': csrfToken,
            },
          )
            .then(({ body }) => {
              if (body.status === 200) {
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
