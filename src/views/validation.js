export class CustomValidation {
  constructor() {
    this.invalidities = [];
    this.validityChecks = [];
  }

  addInvalidity(message) {
    this.invalidities.push(message);
  }

  getInvalidities() {
    return this.invalidities.join('. \n');
  }

  checkValidity(input) {
    this.validityChecks.forEach((value) => {
      const isInvalid = value.isInvalid(input);
      if (isInvalid) {
        this.addInvalidity(value.invalidityMessage);
      }

      const requirementElement = value.element;
      if (requirementElement) {
        if (isInvalid) {
          requirementElement.classList.add('invalid');
          requirementElement.classList.remove('valid');
        } else {
          requirementElement.classList.remove('invalid');
          requirementElement.classList.add('valid');
        }
      }
    });
  }
}

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

export function checkInput(input) {
  // eslint-disable-next-line no-param-reassign
  input.CustomValidation.invalidities = [];
  input.CustomValidation.checkValidity(input);

  if (input.CustomValidation.invalidities.length === 0 && input.value !== '') {
    input.setCustomValidity('');
  } else {
    const message = input.CustomValidation.getInvalidities();
    input.setCustomValidity(message);
  }
  return !!(input.CustomValidation.invalidities.length === 0 && input.value !== '');
}

export function startListeners(inputs, submit, callback) {
  inputs.forEach((input) => {
    input.addEventListener('keyup', (event) => {
      event.preventDefault();
      checkInput(input);
    });
  });

  submit.addEventListener('click', (event) => {
    event.preventDefault();
    let isValid = true;
    // обратный цикл, чтобы последним зарепортился самый верхний input
    for (let i = inputs.length - 1; i >= 0; i -= 1) {
      if (!checkInput(inputs[i])) {
        isValid = false;
      }
      if (!inputs[i].validity.valid) {
        inputs[i].reportValidity();
      }
    }
    if (!isValid) {
      return;
    }
    callback();
  });
}
