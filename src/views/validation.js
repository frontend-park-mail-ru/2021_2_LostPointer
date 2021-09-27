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
    const messageElements = input.nextElementSibling.querySelectorAll('li');
    this.validityChecks.map((item, idx) => ({
      check: item,
      element: messageElements[idx],
    }))
      .forEach(({ check, element }) => {
        const isInvalid = check.isInvalid(input);
        if (isInvalid) {
          this.addInvalidity(check.invalidityMessage);
        }

        const requirementElement = element;
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

  if (input.CustomValidation.invalidities.length === 0) {
    input.setCustomValidity('');
  } else {
    const message = input.CustomValidation.getInvalidities();
    input.setCustomValidity(message);
  }
  return input.CustomValidation.invalidities.length === 0;
}

export function addInputsEventListeners(form) {
  const inputs = form.querySelectorAll('.auth-form__input');

  inputs.forEach((input) => {
    input.addEventListener('input', (event) => {
      event.preventDefault();
      checkInput(input);
    });
  });
}

export function submitFormEvent(event) {
  event.preventDefault();
  const inputsArray = Array.from(document.querySelectorAll('.auth-form__input')).reverse();
  let isValid = true;
  inputsArray.forEach((item) => {
    if (!checkInput(item)) {
      isValid = false;
    }
    if (!item.validity.valid) {
      item.reportValidity();
    }
  });

  if (!isValid) {
    event.stopImmediatePropagation();
  }
}
