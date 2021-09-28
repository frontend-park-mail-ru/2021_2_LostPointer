import { FWComponent } from '../../framework/index.js';
import {
  confirmPasswordInput,
  emailInput,
  nameInput,
  passwordInput,
  simplePasswordInput,
} from './auth.input.js';

class AuthForm extends FWComponent {
  constructor(config) {
    super(config);
    this.template = `
    {{# each inputs}}
        <label for="{{ data.id }}">
          <input class="auth-form__input" type="{{ data.type }}" id="{{ data.id }}" name="{{ data.name }}" placeholder="{{ data.placeholder }}">
          <ul class="auth-form__input-requirements">
              {{# each data.input_requirements}}
                  <li>{{ msg }}</li>
              {{/each}}
          </ul>
      </label>
    {{/each}}
    <div class="auth-form__fail_msg">
        {{ fail_msg }}
    </div>
    <button class="auth-form__submit" type="submit">{{ button_msg }}</button>
    `;
  }
}

export const signupForm = new AuthForm({
  selector: 'auth-form',
  data: {
    fail_msg: 'Registration failed',
    button_msg: 'Sign up',
    inputs: [
      nameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
    ],
  },
});

export const signinForm = new AuthForm({
  selector: 'auth-form',
  data: {
    fail_msg: 'Authentication failed',
    button_msg: 'Sign in',
    inputs: [
      emailInput,
      simplePasswordInput,
    ],
  },
});
