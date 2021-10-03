class ValidityCheck {
  constructor(invalidityMessage, isInvalid) {
    this.invalidityMessage = invalidityMessage;
    this.isInvalid = isInvalid;
    this.element = null;
  }

  setElement(element) {
    this.element = element;
  }
}

export const nameValidityChecks = [
  new ValidityCheck(
    'Name needs to be at least 5 characters',
    (input) => input.value.length < 5,
  ),
  new ValidityCheck(
    'Name allows only letters and numbers',
    (input) => {
      const illegalCharacters = input.value.match(/[^a-zA-Z0-9]/g);
      return !input.value || !!illegalCharacters;
    },
  ),
];

export const emailValidityChecks = [
  new ValidityCheck(
    'Invalid email address',
    (input) => {
      const legalEmail = input.value.match(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/g);
      return !legalEmail;
    },
  ),
];

export const simplePasswordValidityChecks = [
  new ValidityCheck(
    'Password required',
    (input) => input.value === '',
  ),
];

export const passwordValidityChecks = [
  new ValidityCheck(
    'Password needs to be greater then 8 characters',
    (input) => input.value.length < 8,
  ),
  new ValidityCheck(
    'Password requires at least 1 number',
    (input) => !input.value.match(/[0-9]/g),
  ),
  new ValidityCheck(
    'Password requires at least 1 lowercase letter',
    (input) => !input.value.match(/[a-z]/g),
  ),
  new ValidityCheck(
    'Password requires at least 1 uppercase letter',
    (input) => !input.value.match(/[A-Z]/g),
  ),
  new ValidityCheck(
    'Password must contain one of the required special characters',
    // eslint-disable-next-line no-useless-escape
    (input) => !input.value.match(/[\@\ \!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\?\[\\\]\^\_]/g),
  ),
];

export const confirmPasswordValidityChecks = [
  new ValidityCheck(
    'Password confirmation needs to match the password',
    () => {
      const passwordInput = document.querySelector('input[name="password"]');
      const confirmPasswordInput = document.querySelector('input[name="confirm_password"]');
      return !confirmPasswordInput.value
        || confirmPasswordInput.value !== passwordInput.value;
    },
  ),
];