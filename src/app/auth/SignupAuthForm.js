import { Component } from '../../framework/core/component.js';
import { InputFormComponent } from './InputFormComponent.js';

class SignupAuthForm extends Component {
  constructor(config) {
    super(config);
    this.data = {
      fail_msg: 'Registration failed',
      p_redirect_msg: 'Already registered?',
      a_redirect_msg: 'Sign in',
      inputs: [
        new InputFormComponent({
          class: 'auth-form__input',
          name: 'nickname',
          type: 'text',
          placeholder: 'Nickname',
        }),
        new InputFormComponent({
          class: 'auth-form__input',
          name: 'email',
          type: 'email',
          placeholder: 'Email',
        }),
        new InputFormComponent({
          class: 'auth-form__input',
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        }),
        new InputFormComponent({
          class: 'auth-form__input',
          name: 'confirm_password',
          type: 'password',
          placeholder: 'Confirm password',
        }),
      ],
    };
    this.template = Handlebars.templates['signupform.hbs'](this.data);
  }
}

export { SignupAuthForm };
