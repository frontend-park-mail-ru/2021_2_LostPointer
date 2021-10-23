import { Component } from '../../framework/core/component.js';
import { InputFormComponent } from './InputFormComponent.js';

class SigninAuthForm extends Component {
  constructor(config) {
    super(config);
    this.data = {
      fail_msg: 'Authentication failed',
      p_redirect_msg: 'Don\'t have an account?',
      a_redirect_msg: 'Sign up',
      inputs: [
        new InputFormComponent({
          class: 'auth-form__input form__input',
          name: 'email',
          type: 'email',
          placeholder: 'Email',
        }),
        new InputFormComponent({
          class: 'auth-form__input form__input',
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        }),
      ],
    };
    this.template = Handlebars.templates['signinform.hbs'](this.data);
  }
}

export { SigninAuthForm };
