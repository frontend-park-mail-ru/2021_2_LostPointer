import { Component } from '../../framework/core/component.js';
import { InputFormComponent } from './auth.input.js';

class SigninAuthForm extends Component {
  constructor(config) {
    super(config);
    this.data = {
      fail_msg: 'Authentication failed',
      button_msg: 'Sign in',
      inputs: [
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
      ],
    };
    this.template = Handlebars.templates['auth.signinform.hbs'](this.data);
  }
}

export { SigninAuthForm };
