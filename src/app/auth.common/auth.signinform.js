import { Component } from '../../framework/core/component.js';
import { InputFormComponent } from './auth.input.js';

class SigninAuthForm extends Component {
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
        <button class="auth-form__submit" data-link href="/signup" type="submit">Sign up</button>
    </form>
    <div class="auth-form__invalidities"></div>
    `;
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
  }
}

export { SigninAuthForm };
