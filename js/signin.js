import {
  CustomValidation,
  emailValidityChecks,
  startListeners,
// eslint-disable-next-line import/extensions
} from './validation.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const inputs = document.querySelectorAll('.auth-form__input');
const submit = document.querySelector('.auth-form__submit');
const failMsg = document.querySelector('.auth-form__fail_msg');

const passwordValidityChecks = [
  {
    isInvalid(input) {
      // eslint-disable-next-line no-bitwise
      return input.value.length < 8 | input.value.length > 100;
    },
    invalidityMessage: 'Password required',
    element: document.querySelector('label[for="password"] .auth-form__input-requirements li:nth-child(1)'),
  },
];

emailInput.CustomValidation = new CustomValidation();
emailInput.CustomValidation.validityChecks = emailValidityChecks;

passwordInput.CustomValidation = new CustomValidation();
passwordInput.CustomValidation.validityChecks = passwordValidityChecks;

startListeners(inputs, submit, () => {
  fetch('/signin', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
    }),
  })
    .then((response) => {
      if (response.status !== 200) {
        failMsg.classList.add('visible');
      }
      // срендерить следующую страницу
    })
    .catch(() => {
      failMsg.classList.add('visible');
    });
});
