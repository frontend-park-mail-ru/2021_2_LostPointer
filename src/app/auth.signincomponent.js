import { Component } from '../framework/core/component.js';
import { signinForm } from './auth.common/auth.signinform.js';

export class SigninComponent extends Component {
  constructor(config) {
    super(config);
    this.selector = 'app';
    // TODO рендерить signin_form
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
            {{#render form }}
            {{/render}}
        </div>
    </div>
    `;
    this.data = {
      placeholder_img: 'woman_headphones_2.png',
      title: 'Sign in',
      description: 'Let’s get all required data and sign in',
      form: signinForm,
    };
  }
}
