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
            <input class="auth-form__input" type="text" id="name" placeholder="Name">
            <input class="auth-form__input" type="text" id="email" placeholder="Email">
            <input class="auth-form__input" type="text" id="password" placeholder="Password">
            <input class="auth-form__input" type="text" id="confirm_password" placeholder="Confirm password">
            <button class="auth-form__submit" type="submit">Sign up</button>
        </form>
    </div>
    </div>
        `;
  }
}

export default SignupView;
