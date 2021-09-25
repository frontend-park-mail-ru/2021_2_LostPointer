import LoginPage from '../../components/smart/LoginPage.js';

class SigninView {
  constructor() {
    this.title = 'Sign in';
    this.content = new LoginPage('auth-page');
    this.html = this.content.render();
  }
}

export default SigninView;
