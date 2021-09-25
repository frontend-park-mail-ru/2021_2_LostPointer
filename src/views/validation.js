export class CustomValidation {
  constructor(validityChecks) {
    this.invalidities = [];
    this.validityChecks = validityChecks;
  }

  addInvalidity(message) {
    this.invalidities.push(message);
  }

  getInvalidities() {
    return this.invalidities.join('. \n');
  }

  clearInvalidities() {
    this.invalidities = [];
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

export function checkInput(input) {
  input.CustomValidation.clearInvalidities();
  input.CustomValidation.checkValidity(input);

  // TODO разобраться с input.value
  if (input.CustomValidation.invalidities.length === 0 && input.value !== '') {
    input.setCustomValidity('');
  } else {
    const message = input.CustomValidation.getInvalidities();
    input.setCustomValidity(message);
  }
  return !!(input.CustomValidation.invalidities.length === 0 && input.value !== '');
}

// TODO callback to request или перенести в signin/signup
export function startListeners(inputs, form, failMsg, callback) {
  inputs.forEach((input) => {
    // TODO поменять keyup на change
    input.addEventListener('keyup', (event) => {
      event.preventDefault();
      checkInput(input);
    });
  });

  // TODO останавливать распространение при фейле валидации
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;
    // обратный цикл, чтобы последним зарепортился самый верхний input
    // TODO reverse (reduceRight)
    for (let i = inputs.length - 1; i >= 0; i -= 1) {
      if (!checkInput(inputs[i])) {
        isValid = false;
      }
      if (!inputs[i].validity.valid) {
        inputs[i].reportValidity();
      }
    }
    if (!isValid) {
      event.stopPropagation();
      return;
    }
    if (!callback()) {
      event.stopPropagation();
      failMsg.classList.add('visible');
    }
  });
}
