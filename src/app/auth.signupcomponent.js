import { Component } from '../framework/core/component.js';
import { signupForm } from './auth.common/auth.signupform.js';

class SignupComponent extends Component {
  constructor(config) {
    super(config);
    this.selector = 'app';
    this.components = [
      signupForm,
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
      placeholder_img: 'woman_headphones_1.jpeg',
      title: 'Sign up',
      description: 'Let’s get all your required setup information and get started',
    };
  }
}

export const signupComponent = new SignupComponent();
