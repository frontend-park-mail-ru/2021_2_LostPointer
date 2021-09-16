// eslint-disable-next-line import/named
import { addEmailListener, addPasswordListener, ajax } from './auth-utils';

const form = document.getElementById('auth-form');
const email = document.getElementById('email');
const password = document.getElementById('password');

addEmailListener(email);
addPasswordListener(password);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (
    email.value
    && password.value
    && email.validity.valid
    && password.validity.valid
  ) {
    ajax(
      'POST',
      '/signin',
      {
        email: email.value.trim(),
        password: password.value.trim(),
      },
    ).then((response) => {
      if (response.status === 200) {
        // перенаправляем на страницу профиля
      }
    });
  } else if (!email.value) {
    email.setCustomValidity('You need to enter an e-mail address.');
    email.reportValidity();
  } else if (!password.value) {
    password.setCustomValidity('You need to enter a password.');
    password.reportValidity();
  }
});
