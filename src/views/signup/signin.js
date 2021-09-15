class SigninView {
  constructor() {
    this.title = 'Sign in';
    this.html = `
  <div class="auth-page__placeholder">
    <img class="auth_page__placeholder-photo" src="/src/static/img/woman_headphones_2.png">
  </div>
  <div class="auth-page__content">
    <div class="auth-page__logo">
      <img class="auth-page__logo-image" src="/src/static/img/Logo.png">
    </div>
    <div class="auth-page__title">
      Sign in
    </div>
    <div class="auth-page__description">
      Let’s get all required data and sign in
    </div>
    <form class="auth-form" action="#">
      <input class="auth-form__input" type="text" id="email" placeholder="Email">
      <input class="auth-form__input" type="text" id="password" placeholder="Password">
      <button class="auth-form__submit" type="submit">Sign in</button>
    </form>
  </div>
        `;
  }
}

export default SigninView;
