export class CustomValidation {
  constructor(validityChecks, invaliditiesDiv = null) {
    this.invalidities = [];
    this.validityChecks = validityChecks;

    if (invaliditiesDiv) {
      this.validityChecks.forEach((check) => {
        const invalidity = document.createElement('div');
        invalidity.innerText = check.invalidityMessage;
        check.setElement(invalidity);
        invaliditiesDiv.appendChild(invalidity);
      });
    }
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
    this.validityChecks.forEach((check) => {
      const isInvalid = check.isInvalid(input);
      if (isInvalid) {
        check.element.classList.remove('valid');
        check.element.classList.add('invalid');
        this.addInvalidity(check.invalidityMessage);
      } else {
        check.element.classList.remove('invalid');
        check.element.classList.add('valid');
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

export function isValidForm() {
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
  return isValid;
}
