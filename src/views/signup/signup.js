import {
  addInputsEventListeners,
  isValidForm,
  CustomValidation,
} from '../validation.js';
import {
  confirmPasswordValidityChecks,
  emailValidityChecks,
  nameValidityChecks,
  passwordValidityChecks,
} from '../validityChecks.js';
import Request from '../../appApi/request.js';

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
                <input class="auth-form__input" type="text" id="name" name="name" placeholder="Name">
                <ul class="auth-form__input-requirements">
                    <li>At least 5 characters long</li>
                    <li>Must only contain letters and numbers (no special characters)</li>
                </ul>
            </label>
            <label for="email">
                <input class="auth-form__input" type="text" id="email" name="email" placeholder="Email">
                <ul class="auth-form__input-requirements">
                    <li>Valid Email address</li>
                </ul>
            </label>
            <label for="password">
            <input class="auth-form__input" type="password" id="password" name="password" placeholder="Password">
                <ul class="auth-form__input-requirements">
                    <li>At least 8 characters long</li>
                    <li>Contains at least 1 number</li>
                    <li>Contains at least 1 lowercase letter</li>
                    <li>Contains at least 1 uppercase letter</li>
                    <li>Contains a special character (@ !)</li>
                </ul>
            </label>
            <label for="confirm_password">
                <input class="auth-form__input" type="password" id="confirm_password" name="confirm_password" placeholder="Confirm password">
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
  }

  render() {
    const form = document.querySelector('.auth-form');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const confirmPasswordInput = form.querySelector('input[name="confirm_password"]');

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
    const nameInput = event.target.querySelector('input[name="name"]');
    const emailInput = event.target.querySelector('input[name="email"]');
    const passwordInput = event.target.querySelector('input[name="password"]');

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

export default SignupView;
