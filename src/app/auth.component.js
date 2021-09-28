import { FWComponent } from '../framework/index.js';

class AuthComponent extends FWComponent {
}

export const signupComponent = new AuthComponent({
  selector: 'app',
  components: [],
  template: `
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
  `,
});

export const signinComponent = new AuthComponent({
  selector: 'app',
  components: [],
  template: `
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
  `,
});
