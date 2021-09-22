export function CustomValidation() {
  this.invalidities = [];
  this.validityChecks = [];
}

CustomValidation.prototype = {
  invalidities: [],
  validityChecks: [],

  addInvalidity(message) {
    this.invalidities.push(message);
  },
  getInvalidities() {
    return this.invalidities.join('. \n');
  },
  checkValidity(input) {
    for (let i = 0; i < this.validityChecks.length; i += 1) {
      const isInvalid = this.validityChecks[i].isInvalid(input);
      if (isInvalid) {
        this.addInvalidity(this.validityChecks[i].invalidityMessage);
      }

      const requirementElement = this.validityChecks[i].element;
      if (requirementElement) {
        if (isInvalid) {
          requirementElement.classList.add('invalid');
          requirementElement.classList.remove('valid');
        } else {
          requirementElement.classList.remove('invalid');
          requirementElement.classList.add('valid');
        }
      }
    }
  },
};

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
  for (let i = 0; i < inputs.length; i += 1) {
    inputs[i].addEventListener('keyup', (event) => {
      event.preventDefault();
      checkInput(inputs[i]);
    });
  }

  submit.addEventListener('click', (event) => {
    event.preventDefault();
    let isValid = true;
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
