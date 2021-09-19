import {
  addEmailListener, addPasswordListener, ajax, checkValidity,
} from './auth-utils';

const form = document.getElementById('auth-form');
const email = document.getElementById('email');
const password = document.getElementById('password');

addEmailListener(email);
addPasswordListener(password);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (
    !checkValidity(email, 'You need to enter an e-mail address.')
    || !checkValidity(password, 'You need to enter a password.')
  ) {
    return;
  }
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
});
