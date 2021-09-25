import {
  CustomValidation,
  startListeners,
} from '../validation.js';
import {
  emailValidityChecks,
  simplePasswordValidityChecks,
} from '../validityChecks.js';

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

  // eslint-disable-next-line class-methods-use-this
  script() {
    const form = document.querySelector('.auth-form');
    const emailInput = form.querySelector('.auth-form__input[name="email"]');
    const passwordInput = form.querySelector('.auth-form__input[name="password"]');

    emailInput.CustomValidation = new CustomValidation(emailValidityChecks);
    passwordInput.CustomValidation = new CustomValidation(simplePasswordValidityChecks);

    startListeners(form, () => {
      fetch('/signin', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
          email: emailInput.value.trim(),
          password: passwordInput.value.trim(),
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            return Promise.resolve(response);
          }
          return Promise.reject(new Error(response.statusText));
        })
        .then(() => true)
        .catch(() => false);
    });
  }
}

export default SigninView;
