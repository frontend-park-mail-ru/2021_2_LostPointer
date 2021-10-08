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
          name: 'name',
          type: 'text',
          placeholder: 'Name',
        }),
        new InputFormComponent({
          name: 'email',
          type: 'email',
          placeholder: 'Email',
        }),
        new InputFormComponent({
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        }),
        new InputFormComponent({
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
