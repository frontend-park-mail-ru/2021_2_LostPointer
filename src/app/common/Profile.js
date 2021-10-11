import { Component } from '../../framework/core/component.js';
import { InputFormComponent } from '../auth/InputFormComponent.js';
import { ProfileInputComponent } from './ProfileInputComponent.js';

class Profile extends Component {
  constructor(config) {
    super(config);
    this.data = {
      title: 'Edit profile',
      inputs: [
        new ProfileInputComponent({
          label: 'Name',
          input: new InputFormComponent({
            class: 'profile-form__input',
            name: 'name',
            type: 'text',
            placeholder: 'Name',
          }),
        }),
        new ProfileInputComponent({
          label: 'Email',
          input: new InputFormComponent({
            class: 'profile-form__input',
            name: 'email',
            type: 'email',
            placeholder: 'Email',
          }),
        }),
        new ProfileInputComponent({
          label: 'Date of birth',
          input: new InputFormComponent({
            class: 'profile-form__input',
            name: 'date_of_birth',
            type: 'date',
          }),
        }),
        new ProfileInputComponent({
          label: 'Change Password',
          input: new InputFormComponent({
            class: 'profile-form__input',
            name: 'old_password',
            type: 'password',
            placeholder: 'Old password',
          }),
        }),
        new InputFormComponent({
          class: 'profile-form__input',
          name: 'password',
          type: 'password',
          placeholder: 'New password',
        }),
        new InputFormComponent({
          class: 'profile-form__input',
          name: 'confirm_password',
          type: 'password',
          placeholder: 'Confirm password',
        }),
      ],
    };
    this.template = Handlebars.templates['profileform.hbs'](this.data);
  }
}

export { Profile };
