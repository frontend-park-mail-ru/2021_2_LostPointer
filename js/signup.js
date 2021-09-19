import {
  ajax, checkConfirmPassword, checkEmail, checkName, checkPassword,
} from './auth-utils';

const form = document.getElementById('auth-form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm_password');

name.addEventListener('input', (event) => {
  event.preventDefault();
  checkName(name);
});

email.addEventListener('input', (event) => {
  event.preventDefault();
  checkEmail(email);
});

password.addEventListener('input', (event) => {
  event.preventDefault();
  checkPassword(password);
});

confirmPassword.addEventListener('input', (event) => {
  event.preventDefault();
  checkConfirmPassword();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (
    !checkName(name)
    || !checkEmail(email)
    || !checkPassword(password)
    || !checkConfirmPassword()
  ) {
    return;
  }
  ajax(
    'POST',
    '/signup',
    {
      email: email.value.trim(),
      password: password.value.trim(),
      name: name.value.trim(),
    },
  ).then((response) => {
    if (response.status === 200) {
      // перенаправляем на страницу профиля или авторизации
    }
  });
});
