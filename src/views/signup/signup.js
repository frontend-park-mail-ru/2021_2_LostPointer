import {
  CustomValidation,
  emailValidityChecks,
  startListeners,
// eslint-disable-next-line import/extensions
} from '../validation.js';

class SignupView {
  constructor() {
    this.title = 'Signup';
    this.html = `
<div class="login-ui">
    <div class="auth-page__placeholder">
        <img class="auth_page__placeholder-photo" src="/src/static/img/woman_headphones_1.jpeg">
    </div>
    <div class="auth-page__content">
        <div class="auth-page__logo">
            <img class="auth-page__logo-image" data-link href="/" src="/src/static/img/Logo.png">
        </div>
        <div class="auth-page__title">
            Sign up
        </div>
        <div class="auth-page__description">
            Let’s get all your required setup information and get started
        </div>
        <form class="auth-form" action="#">
            <label for="name">
                <input class="auth-form__input" type="text" id="name" placeholder="Name">
                <ul class="auth-form__input-requirements">
                    <li>At least 5 characters long</li>
                    <li>Must only contain letters and numbers (no special characters)</li>
                </ul>
            </label>
            <label for="email">
                <input class="auth-form__input" type="text" id="email" placeholder="Email">
                <ul class="auth-form__input-requirements">
                    <li>Valid Email address</li>
                </ul>
            </label>
            <label for="password">
            <input class="auth-form__input" type="password" id="password" placeholder="Password">
                <ul class="auth-form__input-requirements">
                    <li>At least 8 characters long</li>
                    <li>Contains at least 1 number</li>
                    <li>Contains at least 1 lowercase letter</li>
                    <li>Contains at least 1 uppercase letter</li>
                    <li>Contains a special character (@ !)</li>
                </ul>
            </label>
            <label for="confirm_password">
                <input class="auth-form__input" type="password" id="confirm_password" placeholder="Confirm password">
                <ul class="auth-form__input-requirements">
                    <li>Passwords matching</li>
                </ul>
            </label>
            <div class="auth-form__fail_msg">
                Registration failed
            </div>
            <button class="auth-form__submit" type="submit">Sign up</button>
        </form>
    </div>
    <script type="module" src="js/signup.js"></script>
</div>
        `;
    this.script = () => {
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirm_password');

      const inputs = document.querySelectorAll('.auth-form__input');
      const submit = document.querySelector('.auth-form__submit');
      const failMsg = document.querySelector('.auth-form__fail_msg');

      const nameValidityChecks = [
        {
          isInvalid(input) {
            return input.value.length < 5;
          },
          invalidityMessage: 'This input needs to be at least 5 characters',
          element: document.querySelector('label[for="name"] .auth-form__input-requirements li:nth-child(1)'),
        },
        {
          isInvalid(input) {
            const illegalCharacters = input.value.match(/[^a-zA-Z0-9]/g);
            return !input.value || !!illegalCharacters;
          },
          invalidityMessage: 'Only letters and numbers are allowed',
          element: document.querySelector('label[for="name"] .auth-form__input-requirements li:nth-child(2)'),
        },
      ];

      const passwordValidityChecks = [
        {
          isInvalid(input) {
            return input.value.length < 8;
          },
          invalidityMessage: 'This input needs to be greater then 8 characters',
          element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(1)'),
        },
        {
          isInvalid(input) {
            return !input.value.match(/[0-9]/g);
          },
          invalidityMessage: 'At least 1 number is required',
          element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(2)'),
        },
        {
          isInvalid(input) {
            return !input.value.match(/[a-z]/g);
          },
          invalidityMessage: 'At least 1 lowercase letter is required',
          element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(3)'),
        },
        {
          isInvalid(input) {
            return !input.value.match(/[A-Z]/g);
          },
          invalidityMessage: 'At least 1 uppercase letter is required',
          element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(4)'),
        },
        {
          isInvalid(input) {
            // eslint-disable-next-line no-useless-escape
            return !input.value.match(/[\!\@\#\$\%\^\&\*]/g);
          },
          invalidityMessage: 'You need one of the required special characters',
          element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(5)'),
        },
      ];

      const confirmPasswordValidityChecks = [
        {
          isInvalid() {
            return !confirmPasswordInput.value
              || confirmPasswordInput.value !== passwordInput.value;
          },
          invalidityMessage: 'This password needs to match the first one',
          element: document.querySelector('label[for="confirm_password"] .auth-form__input-requirements li:nth-child(1)'),
        },
      ];

      nameInput.CustomValidation = new CustomValidation();
      nameInput.CustomValidation.validityChecks = nameValidityChecks;

      emailInput.CustomValidation = new CustomValidation();
      emailInput.CustomValidation.validityChecks = emailValidityChecks;

      passwordInput.CustomValidation = new CustomValidation();
      passwordInput.CustomValidation.validityChecks = passwordValidityChecks;

      confirmPasswordInput.CustomValidation = new CustomValidation();
      confirmPasswordInput.CustomValidation.validityChecks = confirmPasswordValidityChecks;

      startListeners(inputs, submit, () => {
        fetch('/signup', {
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
            name: nameInput.value.trim(),
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

export default SignupView;
