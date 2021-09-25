export const nameValidityChecks = [
  {
    isInvalid(input) {
      return input.value.length < 5;
    },
    invalidityMessage: 'This input needs to be at least 5 characters',
    element: document.querySelector('label[for="name"] .auth-form__input-requirements li:nth-child(1)'),
  },
  {
    isInvalid(input) {
      const illegalCharacters = input.value.match(/[^a-zA-Z0-9]/g);
      return !input.value || !!illegalCharacters;
    },
    invalidityMessage: 'Only letters and numbers are allowed',
    element: document.querySelector('label[for="name"] .auth-form__input-requirements li:nth-child(2)'),
  },
];

export const emailValidityChecks = [
  {
    isInvalid(input) {
      const legalEmail = input.value.match(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/g);
      return !legalEmail;
    },
    invalidityMessage: 'Invalid email address',
    element: document.querySelector('label[for="email"] .auth-form__input-requirements li:nth-child(1)'),
  },
];

export const simplePasswordValidityChecks = [
  {
    isInvalid(input) {
      return input.value.length === '';
    },
    invalidityMessage: 'Password required',
    element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(1)'),
  },
];

export const passwordValidityChecks = [
  {
    isInvalid(input) {
      return input.value.length < 8;
    },
    invalidityMessage: 'This input needs to be greater then 8 characters',
    element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(1)'),
  },
  {
    isInvalid(input) {
      return !input.value.match(/[0-9]/g);
    },
    invalidityMessage: 'At least 1 number is required',
    element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(2)'),
  },
  {
    isInvalid(input) {
      return !input.value.match(/[a-z]/g);
    },
    invalidityMessage: 'At least 1 lowercase letter is required',
    element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(3)'),
  },
  {
    isInvalid(input) {
      return !input.value.match(/[A-Z]/g);
    },
    invalidityMessage: 'At least 1 uppercase letter is required',
    element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(4)'),
  },
  {
    isInvalid(input) {
      // eslint-disable-next-line no-useless-escape
      return !input.value.match(/[\!\@\#\$\%\^\&\*]/g);
    },
    invalidityMessage: 'You need one of the required special characters',
    element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(5)'),
  },
];

export const confirmPasswordValidityChecks = [
  {
    isInvalid() {
      const passwordInput = document.querySelector('input[name="password"]');
      const confirmPasswordInput = document.querySelector('input[name="confirm_password"]');
      return !confirmPasswordInput.value
        || confirmPasswordInput.value !== passwordInput.value;
    },
    invalidityMessage: 'This password needs to match the first one',
    // TODO обращаться к элементу не через документ, а через компонент input
    element: document.querySelector('label[for="confirm_password"] .auth-form__input-requirements li:nth-child(1)'),
  },
];
