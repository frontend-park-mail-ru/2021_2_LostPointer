export class CustomValidation {
  constructor(validityChecks, invaliditiesDiv = null) {
    this.invalidities = [];
    this.invalidityDiv = invaliditiesDiv;
    this.validityChecks = validityChecks;
  }

  addInvalidity(message) {
    this.invalidities.push(message);
  }

  clearInvalidities() {
    this.invalidities = [];
  }

  checkValidity(input) {
    this.validityChecks.forEach((check) => {
      const isInvalid = check.isInvalid(input);
      if (isInvalid) {
        this.addInvalidity(check.invalidityMessage);
      }
    });
  }
}

function findInvalidMessage(invaliditiesList, message) {
  let hasMessage = false;

  invaliditiesList.forEach((elem) => {
    const res = elem.innerHTML.indexOf(message);
    if (res !== -1) {
      hasMessage = true;
    }
  });

  return hasMessage;
}

export function checkInput(input) {
  input.CustomValidation.clearInvalidities();
  input.CustomValidation.checkValidity(input);

  const invaliditiesArray = document.querySelectorAll('.auth-form__invalidities');
  if (input.value.length !== 0) {
    input.CustomValidation.invalidities.forEach((message) => {
      const hasMessage = findInvalidMessage(invaliditiesArray, message);
      if (!hasMessage) {
        const invalidity = document.createElement('div');
        invalidity.innerHTML = message;
        invalidity.className = 'invalid';
        input.CustomValidation.invalidityDiv.appendChild(invalidity);
      }
    });

    let amountOfDeletedDivs = 0;
    const invaliditiesListNew = document.querySelector('.auth-form__invalidities');
    const invalidsArray = invaliditiesListNew.innerText.split('\n');
    const innerElements = invaliditiesListNew.getElementsByTagName('div');
    for (let i = 0; i < invalidsArray.length; i += 1) {
      const res = input.CustomValidation.invalidities.indexOf(invalidsArray[i]);
      if (res === -1 && innerElements.length !== 0) {
        let flag = false;
        const pos = i - amountOfDeletedDivs;
        input.CustomValidation.validityChecks.forEach((msg) => {
          if (msg.invalidityMessage === innerElements[pos].innerText) {
            flag = true;
          }
        });
        if (flag) {
          innerElements[pos].remove();
          amountOfDeletedDivs += 1;
        }
      }
    }
  }

  return input.CustomValidation.invalidities.length === 0;
}

export function addInputsEventListeners(form) {
  const inputs = form.querySelectorAll('.auth-form__input');

  inputs.forEach((input) => {
    input.addEventListener('focusout', (event) => {
      event.preventDefault();
      checkInput(input);
    });
  });
}

export function isValidForm() {
  const inputsArray = Array.from(document.querySelectorAll('.auth-form__input'))
    .reverse();
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
