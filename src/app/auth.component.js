import { FWComponent } from '../framework/index.js';
import { signinForm, signupForm } from './auth.common/auth.form.js';

class AuthComponent extends FWComponent {
  constructor(config) {
    super(config);
    this.template = `
    <div class="login-ui">
        <div class="auth-page__placeholder">
            <img class="auth_page__placeholder-photo" src="/src/static/img/{{ placeholder_img }}">
        </div>
        <div class="auth-page__content">
            <div class="auth-page__logo">
                <img class="auth-page__logo-image" data-link href="/" src="/src/static/img/Logo.png">
            </div>
            <div class="auth-page__title">
                {{ title }}
            </div>
            <div class="auth-page__description">
                {{ description }}
            </div>
            <form class="auth-form" id="auth-form" action="#"></form>
        </div>
    </div>
    `;
  }
}

export const signinComponent = new AuthComponent({
  selector: 'app',
  components: [
    signupForm,
  ],
  data: {
    placeholder_img: 'woman_headphones_2.png',
    title: 'Sign in',
    description: 'Let’s get all required data and sign in',
  },
});

export const signupComponent = new AuthComponent({
  selector: 'app',
  components: [
    signinForm,
  ],
  data: {
    placeholder_img: 'woman_headphones_1.jpeg',
    title: 'Sign up',
    description: 'Let’s get all your required setup information and get started',
  },
});
