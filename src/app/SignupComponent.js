import { Component } from '../framework/core/component.js';
import { SignupAuthForm } from './auth/SignupAuthForm.js';
import { addInputsEventListeners, CustomValidation, isValidForm } from '../framework/validation/validation.js';
// eslint-disable-next-line import/no-cycle
import { navigateTo } from '../framework/core/router.js';
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
    this.data = {
      placeholder_img: 'woman_headphones_1.jpeg',
      title: 'Sign up',
      description: 'Let’s get all your required setup information and get started',
      form: new SignupAuthForm(),
    };
    this.template = Handlebars.templates['signupcomponent.hbs'](this.data);
  }

  render() {
    super.render();

    const form = document.querySelector('.auth-form');
    const nicknameInput = form.querySelector('input[name="nickname"]');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const confirmPasswordInput = form.querySelector('input[name="confirm_password"]');
    const invalidities = document.querySelector('.auth-form__invalidities');

    nicknameInput.CustomValidation = new CustomValidation(nameValidityChecks, invalidities);
    emailInput.CustomValidation = new CustomValidation(emailValidityChecks, invalidities);
    passwordInput.CustomValidation = new CustomValidation(passwordValidityChecks, invalidities);
    confirmPasswordInput.CustomValidation = new CustomValidation(
      confirmPasswordValidityChecks, invalidities,
    );

    addInputsEventListeners(form);
    form.addEventListener('submit', this.submitSignupForm);
  }

  submitSignupForm(event) {
    event.preventDefault();
    const errorsField = document.querySelector('.auth-form__fail_msg');
    errorsField.innerHTML = '&nbsp;';

    if (!isValidForm(4)) {
      errorsField.classList.add('visible');
      return;
    }
    const nicknameInput = event.target.querySelector('input[name="nickname"]');
    const emailInput = event.target.querySelector('input[name="email"]');
    const passwordInput = event.target.querySelector('input[name="password"]');

    Request.post(
      '/user/signup',
      JSON.stringify({
        nickname: nicknameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
      }),
    )
      .then(({ status, body }) => {
        if (status === 201) {
          // TODO Переделать navigateTo
          navigateTo('/');
        } else {
          const failMsg = event.target.querySelector('.auth-form__fail_msg');
          failMsg.innerText = body.message;
          failMsg.classList.add('visible');
        }
      })
      .catch((error) => {
        const failMsg = event.target.querySelector('.auth-form__fail_msg');
        failMsg.innerText = error.message;
        failMsg.classList.add('visible');
      });
  }
}
