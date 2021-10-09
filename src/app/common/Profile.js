import { Component } from '../../framework/core/component.js';
import { InputFormComponent } from '../auth/InputFormComponent.js';

class Profile extends Component {
  constructor(config) {
    super(config);
    this.data = {
      title: 'Edit profile',
      inputs: [
        new InputFormComponent({
          class: 'profile-form__input',
          name: 'name',
          type: 'text',
          placeholder: 'Name',
        }),
        new InputFormComponent({
          class: 'profile-form__input',
          name: 'email',
          type: 'email',
          placeholder: 'Email',
        }),
        new InputFormComponent({
          class: 'profile-form__input',
          name: 'date_of_birth',
          type: 'text',
          placeholder: 'Date of birth',
        }),
        new InputFormComponent({
          class: 'profile-form__input',
          name: 'old_password',
          type: 'password',
          placeholder: 'Old password',
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
