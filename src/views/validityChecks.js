export const nameValidityChecks = [
  {
    isInvalid(input) {
      return input.value.length < 5;
    },
    invalidityMessage: 'This input needs to be at least 5 characters',
  },
  {
    isInvalid(input) {
      const illegalCharacters = input.value.match(/[^a-zA-Z0-9]/g);
      return !input.value || !!illegalCharacters;
    },
    invalidityMessage: 'Only letters and numbers are allowed',
  },
];

export const emailValidityChecks = [
  {
    isInvalid(input) {
      const legalEmail = input.value.match(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/g);
      return !legalEmail;
    },
    invalidityMessage: 'Invalid email address',
  },
];

export const simplePasswordValidityChecks = [
  {
    isInvalid(input) {
      return input.value === '';
    },
    invalidityMessage: 'Password required',
  },
];

export const passwordValidityChecks = [
  {
    isInvalid(input) {
      return input.value.length < 8;
    },
    invalidityMessage: 'This input needs to be greater then 8 characters',
  },
  {
    isInvalid(input) {
      return !input.value.match(/[0-9]/g);
    },
    invalidityMessage: 'At least 1 number is required',
  },
  {
    isInvalid(input) {
      return !input.value.match(/[a-z]/g);
    },
    invalidityMessage: 'At least 1 lowercase letter is required',
  },
  {
    isInvalid(input) {
      return !input.value.match(/[A-Z]/g);
    },
    invalidityMessage: 'At least 1 uppercase letter is required',
  },
  {
    isInvalid(input) {
      // eslint-disable-next-line no-useless-escape
      return !input.value.match(/[\!\@\#\$\%\^\&\*]/g);
    },
    invalidityMessage: 'You need one of the required special characters',
  },
];

export const confirmPasswordValidityChecks = [
  {
    isInvalid() {
      const passwordInput = document.querySelector('.auth-form__input[name="password"]');
      const confirmPasswordInput = document.querySelector('.auth-form__input[name="confirm_password"]');
      return !confirmPasswordInput.value
        || confirmPasswordInput.value !== passwordInput.value;
    },
    invalidityMessage: 'This password needs to match the first one',
  },
];
