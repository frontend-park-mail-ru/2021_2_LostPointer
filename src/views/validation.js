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
export function startListeners(form, callback) {
  const inputs = document.querySelectorAll('.auth-form__input');
  const failMsg = form.querySelector('.auth-form__fail_msg');

  inputs.forEach((input) => {
    input.addEventListener('input', (event) => {
      event.preventDefault();
      checkInput(input);
    });
  });

  // TODO останавливать распространение при фейле валидации
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;
    inputs.reverse().forEach((item) => {
      if (!checkInput(item)) {
        isValid = false;
      }
      if (!item.validity.valid) {
        item.reportValidity();
      }
    }).reverse();

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
