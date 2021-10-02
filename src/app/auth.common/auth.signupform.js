import { Component } from '../../framework/core/component.js';
import {
  confirmPasswordInput,
  emailInput,
  nameInput,
  passwordInput,
} from './auth.input.js';

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
        
        <div class="auth-form__buttons">
            <button class="auth-form__submit" type="submit">{{ button_signup_msg }}</button>
            <div class="auth-form__redirect">
                <p>{{ p_redirect_msg }}</p>
                <a data-link href="/signin" style="color: #FFFFFF">{{ a_redirect_msg }}</a>
            </div>
        </div>       
     </form>
    `;
    this.data = {
      fail_msg: 'Registration failed',
      button_signup_msg: 'Sign up',
      p_redirect_msg: 'Already registered?',
      a_redirect_msg: 'Sign in',
      inputs: [
        nameInput,
        emailInput,
        passwordInput,
        confirmPasswordInput,
      ],
    };
  }
}

export { SignupAuthForm };
