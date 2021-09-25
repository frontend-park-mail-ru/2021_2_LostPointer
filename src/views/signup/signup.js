import SignupPage from '../../components/smart/SignupPage.js';

class SignupView {
  constructor() {
    this.title = 'Signup';
    this.content = new SignupPage('auth-page');
    this.html = this.content.render();
  }
}

export default SignupView;
