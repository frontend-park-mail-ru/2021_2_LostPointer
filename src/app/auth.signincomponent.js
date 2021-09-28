import { FWComponent } from '../framework/index.js';
import { signinForm } from './auth.common/auth.signinform.js';

class SigninComponent extends FWComponent {
  constructor(config) {
    super(config);
    this.selector = 'app';
    this.components = [
      signinForm,
    ];
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
    this.data = {
      placeholder_img: 'woman_headphones_2.png',
      title: 'Sign in',
      description: 'Let’s get all required data and sign in',
    };
  }
}

export const signinComponent = new SigninComponent();
