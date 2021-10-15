import { Component } from '../../framework/core/component.js';
import { InputFormComponent } from '../auth/InputFormComponent.js';
import { ProfileInputComponent } from './ProfileInputComponent.js';

class Profile extends Component {
  constructor(config) {
    super(config);
    this.data = {
      title: 'Profile settings',
      inputs: [
        new ProfileInputComponent({
          label: 'Name',
          input: new InputFormComponent({
            class: 'profile-form__input',
            name: 'name',
            type: 'text',
            placeholder: 'Name',
            value: config.nickname,
          }),
        }),
        new ProfileInputComponent({
          label: 'Email',
          input: new InputFormComponent({
            class: 'profile-form__input',
            name: 'email',
            type: 'email',
            placeholder: 'Email',
            value: config.email,
          }),
        }),
      ],
      password_inputs: [
        new ProfileInputComponent({
          label: 'Old password',
          input: new InputFormComponent({
            class: 'profile-form__input',
            name: 'old_password',
            type: 'password',
          }),
        }),
        new ProfileInputComponent({
          label: 'New password',
          input: new InputFormComponent({
            class: 'profile-form__input',
            name: 'password',
            type: 'password',
          }),
        }),
        new ProfileInputComponent({
          label: 'Confirm password',
          input: new InputFormComponent({
            class: 'profile-form__input',
            name: 'confirm_password',
            type: 'password',
          }),
        }),
      ],
    };
    this.template = Handlebars.templates['profileform.hbs'](this.data);
  }
}

export { Profile };
