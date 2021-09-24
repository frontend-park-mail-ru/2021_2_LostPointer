import {
  CustomValidation,
  emailValidityChecks,
  startListeners,
// eslint-disable-next-line import/extensions
} from '../validation.js';

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
        <input class="auth-form__input" type="text" id="email" placeholder="Email">
        <ul class="auth-form__input-requirements">
          <li>Email required</li>
        </ul>
      </label>
      <label for="password">
        <input class="auth-form__input" type="password" id="password" placeholder="Password">
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
    this.script = () => {
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');

      const inputs = document.querySelectorAll('.auth-form__input');
      const submit = document.querySelector('.auth-form__submit');
      const failMsg = document.querySelector('.auth-form__fail_msg');

      const passwordValidityChecks = [
        {
          isInvalid(input) {
            // eslint-disable-next-line no-bitwise
            return input.value.length < 8;
          },
          invalidityMessage: 'This input needs to be at least 5 characters',
          element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(1)'),
        },
      ];

      emailInput.CustomValidation = new CustomValidation();
      emailInput.CustomValidation.validityChecks = emailValidityChecks;

      passwordInput.CustomValidation = new CustomValidation();
      passwordInput.CustomValidation.validityChecks = passwordValidityChecks;

      startListeners(inputs, submit, () => {
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
            if (response.status !== 200) {
              failMsg.classList.add('visible');
            } else {
              // срендерить следующую страницу
            }
          })
          .catch(() => {
            failMsg.classList.add('visible');
          });
      });
    };
  }
}

export default SigninView;
