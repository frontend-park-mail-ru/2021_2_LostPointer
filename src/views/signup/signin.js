import {
  addInputsEventListeners,
  isValidForm,
  CustomValidation,
} from '../validation.js';
import {
  emailValidityChecks,
  simplePasswordValidityChecks,
} from '../validityChecks.js';
import Request from '../../appApi/request.js';

class SigninView {
  constructor() {
    this.title = 'Sign in';
    this.html = `
<div class="login-ui">
  <div class="auth-page__placeholder">
    <img class="auth_page__placeholder-photo" src="/src/static/img/woman_headphones_2.png">
  </div>
  <div class="auth-page__content">
    <div class="auth-page__logo">
      <img class="auth-page__logo-image" data-link href="/" src="/src/static/img/Logo.png">
    </div>
    <div class="auth-page__title">
      Sign in
    </div>
    <div class="auth-page__description">
      Let’s get all required data and sign in
    </div>
    <form class="auth-form" id="auth-form" action="#">
      <label for="email">
        <input class="auth-form__input" type="text" id="email" name="email" placeholder="Email">
        <ul class="auth-form__input-requirements">
          <li>Email required</li>
        </ul>
      </label>
      <label for="password">
        <input class="auth-form__input" type="password" id="password" name="password" placeholder="Password">
        <ul class="auth-form__input-requirements">
          <li>Password required</li>
        </ul>
      </label>
      <div class="auth-form__fail_msg">
        Authentication failed
      </div>
      <button class="auth-form__submit" type="submit">Sign in</button>
    </form>
  </div>
</div>
        `;
  }

  render() {
    const form = document.querySelector('.auth-form');
    const emailInput = form.querySelector('.auth-form__input[name="email"]');
    const passwordInput = form.querySelector('.auth-form__input[name="password"]');

    emailInput.CustomValidation = new CustomValidation(emailValidityChecks);
    passwordInput.CustomValidation = new CustomValidation(simplePasswordValidityChecks);

    addInputsEventListeners(form);
    form.addEventListener('submit', this.submitSigninForm);
  }

  // eslint-disable-next-line class-methods-use-this
  submitSigninForm(event) {
    event.preventDefault();
    if (!isValidForm()) {
      return;
    }
    const emailInput = event.target.querySelector('.auth-form__input[name="email"]');
    const passwordInput = event.target.querySelector('.auth-form__input[name="password"]');

    Request.post(
      '/signin',
      JSON.stringify({
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
      }),
    )
      .then(({ status }) => {
        if (status === 200) {
          window.history.replaceState(null, null, '/');
          window.history.go(0);
        } else {
          const failMsg = event.target.querySelector('.auth-form__fail_msg');
          failMsg.classList.add('visible');
        }
      })
      // eslint-disable-next-line no-console
      .catch((error) => { console.log(error.msg); });
  }
}

export default SigninView;
