import {
  ajax, checkEmail, checkPassword,
} from './auth-utils';

const form = document.getElementById('auth-form');
const email = document.getElementById('email');
const password = document.getElementById('password');

email.addEventListener('input', (event) => {
  event.preventDefault();
  checkEmail(email);
});

password.addEventListener('input', (event) => {
  event.preventDefault();
  checkPassword(password);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (
    !checkEmail(email)
    || !checkPassword(password)
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
