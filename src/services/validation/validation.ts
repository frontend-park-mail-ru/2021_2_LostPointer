export class CustomValidation {
  private invalidities: string[];
  private invalidityDiv: Element;
  private validityChecks: any;

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
  }
  let amountOfDeletedDivs = 0;
  const invaliditiesListNew = <HTMLInputElement>document.querySelector('.auth-form__invalidities');
  const invalidsArray = invaliditiesListNew.innerText.split('\n');
  const innerElements = invaliditiesListNew.getElementsByTagName('div');
  for (let i = 0; i < invalidsArray.length; i++) {
    const res = input.CustomValidation.invalidities.indexOf(invalidsArray[i]);
    if (res === -1 && innerElements.length !== 0) {
      let flag = false;
      const pos = i - amountOfDeletedDivs;
      input.CustomValidation.validityChecks.forEach((msg) => {
        if (msg.invalidityMessage === innerElements[pos].innerText) {
          flag = true; //TODO=Завершать цикл сразу, а не идти дальше
        }
      });
      if (flag) {
        innerElements[pos].remove();
        amountOfDeletedDivs++;
      }
    }
  }

  const isEmpty = input.value === '';
  const isValid = input.CustomValidation.invalidities.length === 0;

  return [isValid, isEmpty];
}

function checkInputEventListener(input, event) {
  event.preventDefault();
  checkInput(input);
}

export function addInputsEventListeners(form) {
  const inputs = form.querySelectorAll('.auth-form__input');

  inputs.forEach((input) => {
    input.addEventListener('focusout', checkInputEventListener.bind(null, input));
  });
}

export function removeInputsEventListeners(form) {
  const inputs = form.querySelectorAll('.auth-form__input');

  inputs.forEach((input) => {
    input.removeEventListener('focusout', checkInputEventListener.bind(null, input));
  });
}

export function isValidForm(amountOfInputs) {
  const inputsArray = Array.from(document.querySelectorAll('.auth-form__input'))
    .reverse();
  let isValid = true;
  let emptyFields = 0;
  inputsArray.forEach((item) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // TODO=WTF???????
    let isEmpty: boolean;
    let isValidTmp: boolean;
    // eslint-disable-next-line prefer-const
    [isValidTmp, isEmpty] = checkInput(item);
    if (!isValidTmp) {
      isValid = false;
    }
    if (isEmpty) {
      emptyFields++;
    }
  });

  const invalidity = document.querySelector('.auth-form__fail_msg');
  if (emptyFields === amountOfInputs) {
    invalidity.innerHTML = 'Please, fill out the form';
  } else if (emptyFields < amountOfInputs && emptyFields !== 0) {
    invalidity.innerHTML = 'Please, fill in the remaining fields';
  }

  return isValid && emptyFields === 0;
}
