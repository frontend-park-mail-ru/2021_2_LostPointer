import SigninPage from '../../components/smart/SigninPage.js';

class SigninView {
  constructor() {
    this.title = 'Sign in';
    this.content = new SigninPage('auth-page');
    this.html = this.content.render();
  }
}

export default SigninView;
