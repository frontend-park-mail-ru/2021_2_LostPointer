export class CustomValidation {
  constructor(validityChecks, invaliditiesDiv = null) {
    this.invalidities = [];
    this.invalidityDiv = invaliditiesDiv;
    this.validityChecks = validityChecks;

    // if (invaliditiesDiv) {
    //   this.validityChecks.forEach((check) => {
    //     const invalidity = document.createElement('div');
    //     invalidity.innerText = check.invalidityMessage;
    //     check.setElement(invalidity);
    //     invaliditiesDiv.appendChild(invalidity);
    //   });
    // }
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
        this.addInvalidity(check.invalidityMessage);
        // const invalidity = document.createElement('div');
        // invalidity.innerHTML = check.invalidityMessage;
        // check.setElement(invalidity);
        // check.element.classList.add('invalid');
        // this.invalidityDiv.appendChild(invalidity);
        // check.element.classList.remove('valid');
        // this.addInvalidity(check.invalidityMessage);
      } else {

        // check.element.classList.remove('invalid');
        // check.element.classList.add('valid');
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

  const invaliditiesHtmlCollecton = document.getElementsByClassName('auth-form__invalidities');
  const invaliditiesList = Array.from(invaliditiesHtmlCollecton);

  if (input.value.length !== 0) {
    input.CustomValidation.invalidities.forEach((message) => {
      const hasMessage = findInvalidMessage(invaliditiesList, message);
      if (!hasMessage) {
        const invalidity = document.createElement('div');
        invalidity.innerHTML = message;
        invalidity.className = 'invalid';
        input.CustomValidation.invalidityDiv.appendChild(invalidity);
      }
    });

    let amountDeletedDivs = 0;
    const invaliditiesListNew = document.querySelector('.auth-form__invalidities');
    const invalidsArray = invaliditiesListNew.innerText.split('\n');
    const innerElements = invaliditiesListNew.getElementsByTagName('div');
    for (let i = 0; i < invalidsArray.length; i += 1) {
      const pos = input.CustomValidation.invalidities.indexOf(invalidsArray[i]);
      if (pos === -1) {
        innerElements[i - amountDeletedDivs].remove();
        amountDeletedDivs += 1;
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
