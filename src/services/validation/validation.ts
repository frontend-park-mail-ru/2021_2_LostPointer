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

    const invaliditiesArray = document.querySelectorAll('.form__invalidities');
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
    const invaliditiesListNewArray = document.querySelectorAll(
        '.form__invalidities'
    );
    invaliditiesListNewArray.forEach((invaliditiesListNew) => {
        const invalidsArray = (<HTMLInputElement>(
            invaliditiesListNew
        )).innerText.split('\n');
        const innerElements = invaliditiesListNew.getElementsByTagName('div');
        for (let i = 0; i < invalidsArray.length; i++) {
            const res = input.CustomValidation.invalidities.indexOf(
                invalidsArray[i]
            );
            if (res === -1 && innerElements.length !== 0) {
                let flag = false;
                const pos = i - amountOfDeletedDivs;
                input.CustomValidation.validityChecks.forEach((msg) => {
                    if (
                        msg.invalidityMessage === innerElements[pos].innerText
                    ) {
                        flag = true; //TODO=?????????????????? ???????? ??????????, ?? ???? ???????? ????????????
                    }
                });
                if (flag) {
                    innerElements[pos].remove();
                    amountOfDeletedDivs++;
                }
            }
        }
    });

    const isEmpty = input.value === '';
    const isValid = input.CustomValidation.invalidities.length === 0;

    return [isValid, isEmpty];
}

function checkInputEventListener(input, event) {
    event.preventDefault();
    checkInput(input);
}

export function addInputsEventListeners(form) {
    const inputs = form.querySelectorAll('.form__input');

    inputs.forEach((input) => {
        input.addEventListener(
            'focusout',
            checkInputEventListener.bind(null, input)
        );
    });
}

export function removeInputsEventListeners(form) {
    const inputs = form.querySelectorAll('.form__input');

    inputs.forEach((input) => {
        input.removeEventListener(
            'focusout',
            checkInputEventListener.bind(null, input)
        );
    });
}

export function isValidForm(amountOfInputs) {
    const inputsArray = Array.from(
        document.querySelectorAll('.form__input')
    ).reverse();
    let isValid = true;
    let emptyFields = 0;
    inputsArray
        .filter((item) =>
            Object.prototype.hasOwnProperty.call(item, 'CustomValidation')
        )
        .forEach((item) => {
            let isEmpty = false;
            let isValidTmp = false;
            [isValidTmp, isEmpty] = checkInput(item);
            if (!isValidTmp) {
                isValid = false;
            }
            if (isEmpty) {
                emptyFields += 1;
            }
        });

    const invalidity = document.querySelector('.form__fail_msg');
    if (emptyFields === amountOfInputs) {
        invalidity.innerHTML = 'Please, fill out the form';
    } else if (emptyFields < amountOfInputs && emptyFields !== 0) {
        invalidity.innerHTML = 'Please, fill in the remaining fields';
    }

    return isValid && emptyFields === 0;
}
