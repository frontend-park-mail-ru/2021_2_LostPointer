import { Component } from '../../framework/core/component.js';
import { InputFormComponent } from './auth.input.js';

class SignupAuthForm extends Component {
  constructor(config) {
    super(config);
    this.template = `
    <form class="auth-form" id="auth-form" action="#">
        {{# each inputs}}
            {{# render this}}{{/render}}
        {{/each}}
        <div class="auth-form__fail_msg">
            {{ fail_msg }}
        </div>
        <button class="auth-form__submit" type="submit">{{ button_msg }}</button>
        <button class="auth-form__submit" data-link href="/signin" type="submit">Sign in</button>
    </form>
    <div class="auth-form__invalidities"></div>
    `;
    this.data = {
      fail_msg: 'Registration failed',
      button_msg: 'Sign up',
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
  }
}

export { SignupAuthForm };
