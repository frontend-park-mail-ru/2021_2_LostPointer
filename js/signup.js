import {
  addEmailListener, addPasswordListener, ajax, checkValidity,
} from './auth-utils';

const form = document.getElementById('auth-form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm_password');

name.addEventListener('input', () => {
  if (!name.value) {
    name.setCustomValidity('You need to enter a name.');
  } else if (name.validity.tooShort) {
    name.setCustomValidity('Must contain at least 5 or more characters.');
  } else {
    name.setCustomValidity('');
  }
});

addEmailListener(email);
addPasswordListener(password);

confirmPassword.addEventListener('input', () => {
  if (confirmPassword.value !== password.value) {
    confirmPassword.setCustomValidity('You need to confirm a password.');
  } else {
    confirmPassword.setCustomValidity('');
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (
    !checkValidity(name, 'You need to enter a name.')
    || !checkValidity(email, 'You need to enter an e-mail address.')
    || !checkValidity(password, 'You need to enter a password.')
    || !checkValidity(confirmPassword, 'You need to confirm a password.')
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
