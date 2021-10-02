import { Component } from '../framework/core/component.js';
import { SigninAuthForm } from './auth.common/auth.signinform.js';
import Request from '../framework/appApi/request.js';
import { addInputsEventListeners, CustomValidation, isValidForm } from '../framework/validation/validation.js';
import { emailValidityChecks, simplePasswordValidityChecks } from '../framework/validation/validityChecks.js';
// eslint-disable-next-line import/no-cycle
import { navigateTo } from '../framework/core/router.js';

export class SigninComponent extends Component {
  constructor(config) {
    super(config);
    // TODO рендерить signin_form
    this.template = `
    <div class="login-ui">
        <div class="auth-page__placeholder">
            <img class="auth_page__placeholder-photo" src="/src/static/img/{{ placeholder_img }}">
        </div>
        <div class="auth-page__content">
            <div class="auth-page__logo">
                <img class="auth-page__logo-image" data-link href="/" src="/src/static/img/Logo.png">
            </div>
            <div class="auth-page__title">
                {{ title }}
            </div>
            <div class="auth-page__description">
                {{ description }}
            </div>
            {{#render form }}{{/render}}
        </div>
    </div>
    `;
    this.data = {
      placeholder_img: 'woman_headphones_2.png',
      title: 'Sign in',
      description: 'Let’s get all required data and sign in',
      form: new SigninAuthForm(),
    };
  }

  render() {
    super.render();

    const form = document.querySelector('.auth-form');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');

    emailInput.CustomValidation = new CustomValidation(emailValidityChecks);
    passwordInput.CustomValidation = new CustomValidation(simplePasswordValidityChecks);

    addInputsEventListeners(form);
    form.addEventListener('submit', this.submitSigninForm);
  }

  submitSigninForm(event) {
    event.preventDefault();
    if (!isValidForm()) {
      return;
    }
    const emailInput = event.target.querySelector('input[name="email"]');
    const passwordInput = event.target.querySelector('input[name="password"]');

    Request.post(
      '/user/signin',
      JSON.stringify({
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
      }),
    )
      .then(({ status, body }) => {
        console.log(status);
        if (status === 200) {
          // TODO заменить navitageTo
          navigateTo('/');
        } else {
          const failMsg = event.target.querySelector('.auth-form__fail_msg');
          failMsg.innerText = body.message;
          failMsg.classList.add('visible');
        }
      })
      .catch((error) => {
        const failMsg = event.target.querySelector('.auth-form__fail_msg');
        failMsg.innerText = 'Authentication failed';
        failMsg.classList.add('visible');
        console.log(error.msg);
      });
  }
}
