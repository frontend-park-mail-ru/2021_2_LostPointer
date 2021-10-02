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
        <div class="auth-form__buttons">
            <button class="auth-form__submit" type="submit">{{ button_signin_msg }}</button>
            <div class="auth-form__redirect">
                <p>{{ p_redirect_msg }}</p>
                <a data-link href="/signup" style="color: #FFFFFF">{{ a_redirect_msg }}</a>
            </div>
        </div>
    </form>
    <div class="auth-form__invalidities"></div>
    `;
    this.data = {
      fail_msg: 'Authentication failed',
      button_signin_msg: 'Sign in',
      p_redirect_msg: 'Don\'t have an account?',
      a_redirect_msg: 'Sign up',
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
