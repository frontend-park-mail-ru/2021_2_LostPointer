const form = document.getElementsByTagName('form')[0];
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

email.addEventListener('input', () => {
  if (!email.value) {
    email.setCustomValidity('You need to enter an e-mail address.');
  } else if (email.validity.typeMismatch) {
    email.setCustomValidity('Entered value needs to be an e-mail address.');
  } else if (email.validity.patternMismatch) {
    email.setCustomValidity('Entered value needs to be an e-mail address.');
  } else {
    email.setCustomValidity('');
  }
});

password.addEventListener('input', () => {
  if (!password.value) {
    password.setCustomValidity('You need to enter a password.');
  } else if (password.validity.patternMismatch) {
    password.setCustomValidity('Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.');
  } else {
    password.setCustomValidity('');
  }
});

confirmPassword.addEventListener('input', () => {
  if (confirmPassword.value !== password.value) {
    confirmPassword.setCustomValidity('You need to confirm a password.');
  } else {
    confirmPassword.setCustomValidity('');
  }
});

form.addEventListener('submit', (event) => {
  if (
    !name.value
    || !email.value
    || !password.value
    || !confirmPassword.value
    || !name.validity.valid
    || !email.validity.valid
    || !password.validity.valid
    || !confirmPassword.validity.valid
  ) {
    if (!name.value) {
      name.setCustomValidity('You need to enter a name.');
      name.reportValidity();
    } else if (!email.value) {
      email.setCustomValidity('You need to enter an e-mail address.');
      email.reportValidity();
    } else if (!password.value) {
      password.setCustomValidity('You need to enter a password.');
      password.reportValidity();
    } else if (!confirmPassword.value) {
      confirmPassword.setCustomValidity('You need to confirm a password.');
      confirmPassword.reportValidity();
    }
    event.preventDefault();
  }
});
