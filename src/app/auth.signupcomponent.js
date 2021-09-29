import { Component } from '../framework/core/component.js';
import { signupForm } from './auth.common/auth.signupform.js';
import { addInputsEventListeners, CustomValidation, isValidForm } from '../framework/validation/validation.js';
import {
  confirmPasswordValidityChecks,
  emailValidityChecks,
  nameValidityChecks,
  passwordValidityChecks,
} from '../framework/validation/validityChecks.js';
import Request from '../framework/appApi/request.js';

export class SignupComponent extends Component {
  constructor(config) {
    super(config);
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
      placeholder_img: 'woman_headphones_1.jpeg',
      title: 'Sign up',
      description: 'Let’s get all your required setup information and get started',
      form: signupForm,
    };
  }

  render() {
    super.render();

    const form = document.querySelector('.auth-form');
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const confirmPasswordInput = form.querySelector('#confirm_password');

    nameInput.CustomValidation = new CustomValidation(nameValidityChecks);
    emailInput.CustomValidation = new CustomValidation(emailValidityChecks);
    passwordInput.CustomValidation = new CustomValidation(passwordValidityChecks);
    confirmPasswordInput.CustomValidation = new CustomValidation(
      confirmPasswordValidityChecks,
    );

    addInputsEventListeners(form);
    form.addEventListener('submit', this.submitSignupForm);
  }

  // eslint-disable-next-line class-methods-use-this
  submitSignupForm(event) {
    event.preventDefault();
    if (!isValidForm()) {
      return;
    }
    const nameInput = event.target.querySelector('#name');
    const emailInput = event.target.querySelector('#email');
    const passwordInput = event.target.querySelector('#password');

    Request.post(
      '/signup',
      JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
      }),
    )
      .then(({ status, body }) => {
        if (status === 200) {
          window.history.replaceState(null, null, '/');
          window.history.go(0);
        } else {
          const failMsg = event.target.querySelector('.auth-form__fail_msg');
          failMsg.innerText = body.msg;
          failMsg.classList.add('visible');
        }
      })
      // eslint-disable-next-line no-console
      .catch((error) => { console.log(error.msg); });
  }
}
