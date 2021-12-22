import { EMAIL, LETTER, NAME, NUMBER } from 'store/regex';

export class ValidityCheck {
    private invalidityMessage: string;
    private isInvalid: boolean;
    private element: null;

    constructor(invalidityMessage, isInvalid) {
        this.invalidityMessage = invalidityMessage;
        this.isInvalid = isInvalid;
        this.element = null;
    }

    setElement(element) {
        this.element = element;
    }
}

export const nameValidityChecks = [
    new ValidityCheck(
        'Name needs to be at least 3 characters',
        (input) => input.value.length < 3
    ),
    new ValidityCheck(
        "Name allows only letters and numbers and '_'",
        (input) => {
            const illegalCharacters = input.value.match(NAME);
            return !illegalCharacters;
        }
    ),
];

export const emailValidityChecks = [
    new ValidityCheck('Invalid email address', (input) => {
        const legalEmail = input.value.match(EMAIL);
        return !legalEmail;
    }),
];

export const simplePasswordValidityChecks = [
    new ValidityCheck('Password required', (input) => input.value === ''),
];

export const passwordValidityChecks = [
    new ValidityCheck(
        'Password needs to be 8 or more characters',
        (input) => input.value.length < 8
    ),
    new ValidityCheck(
        'Password requires at least 1 number',
        (input) => !input.value.match(NUMBER)
    ),
    new ValidityCheck(
        'Password requires at least 1 letter',
        (input) => !input.value.match(LETTER)
    ),
    new ValidityCheck("New password doesn't need to match the old one", () => {
        const oldPasswordInput = document.querySelector(
            'input[name="old_password"]'
        ) as HTMLTextAreaElement;
        if (!oldPasswordInput) {
            return false;
        }

        const passwordInput = document.querySelector(
            'input[name="password"]'
        ) as HTMLTextAreaElement;
        const isEmpty = passwordInput.value === '';
        if (isEmpty) {
            return false;
        }
        return oldPasswordInput.value === passwordInput.value;
    }),
];

export const confirmPasswordValidityChecks = [
    new ValidityCheck(
        'Password confirmation needs to match the password',
        () => {
            const passwordInput = document.querySelector(
                'input[name="password"]'
            ) as HTMLTextAreaElement;
            const confirmPasswordInput = document.querySelector(
                'input[name="confirm_password"]'
            ) as HTMLTextAreaElement;
            const isEmpty = confirmPasswordInput.value === '';
            if (isEmpty) {
                return false;
            }
            return confirmPasswordInput.value !== passwordInput.value;
        }
    ),
];
