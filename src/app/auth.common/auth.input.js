import { Component } from '../../framework/core/component.js';

export const nameInput = new Component({
  data: {
    id: 'name',
    type: 'text',
    placeholder: 'Name',
    input_requirements: [
      {
        msg: 'At least 5 characters long',
      },
      {
        msg: 'Must only contain letters and numbers (no special characters)',
      },
    ],
  },
});

export const emailInput = new Component({
  data: {
    id: 'email',
    type: 'text',
    placeholder: 'Email',
    input_requirements: [
      {
        msg: 'Valid Email address',
      },
    ],
  },
});

export const simplePasswordInput = new Component({
  data: {
    id: 'password',
    type: 'password',
    placeholder: 'Password',
    input_requirements: [
      {
        msg: 'Password required',
      },
    ],
  },
});

export const passwordInput = new Component({
  data: {
    id: 'password',
    type: 'password',
    placeholder: 'Password',
    input_requirements: [
      {
        msg: 'At least 8 characters long',
      },
      {
        msg: 'Contains at least 1 number',
      },
      {
        msg: 'Contains at least 1 lowercase letter',
      },
      {
        msg: 'Contains at least 1 uppercase letter',
      },
      {
        msg: 'Contains a special character (@ !)',
      },
    ],
  },
});

export const confirmPasswordInput = new Component({
  data: {
    id: 'confirm_password',
    type: 'password',
    placeholder: 'Confirm password',
    input_requirements: [
      {
        msg: 'Passwords matching',
      },
    ],
  },
});
