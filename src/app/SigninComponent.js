import { Component } from '../framework/core/component.js';
import { SigninAuthForm } from './auth/SigninAuthForm.js';
import Request from '../framework/appApi/request.js';
import { addInputsEventListeners, CustomValidation, isValidForm } from '../framework/validation/validation.js';
import { emailValidityChecks, simplePasswordValidityChecks } from '../framework/validation/validityChecks.js';
import router from '../framework/core/router.js';

export class SigninComponent extends Component {
  constructor(config) {
    super(config);
    // TODO рендерить signin_form
    this.data = {
      placeholder_img: 'woman_headphones_2.png',
      title: 'Sign in',
      description: 'Let’s get all required data and sign in',
      form: new SigninAuthForm(),
    };
    this.template = Handlebars.templates['signincomponent.hbs'](this.data);
  }

  render() {
    super.render();

    const form = document.querySelector('.auth-form');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const invalidities = document.querySelector('.auth-form__invalidities');

    emailInput.CustomValidation = new CustomValidation(emailValidityChecks, invalidities);
    passwordInput.CustomValidation = new CustomValidation(
      simplePasswordValidityChecks, invalidities,
    );

    addInputsEventListeners(form);
    form.addEventListener('submit', this.submitSigninForm);
  }

  submitSigninForm(event) {
    event.preventDefault();
    const errorsField = document.querySelector('.auth-form__fail_msg');
    errorsField.innerHTML = '&nbsp;';

    if (!isValidForm(2)) {
      errorsField.classList.add('visible');
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
        if (status === 200) {
          router.go('/');
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
