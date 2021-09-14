const form = document.getElementsByTagName('form')[0];
const email = document.getElementById('email');
const password = document.getElementById('password');

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

form.addEventListener('submit', (event) => {
  if (
    !email.value
    || !password.value
    || !email.validity.valid
    || !password.validity.valid
  ) {
    if (!email.value) {
      email.setCustomValidity('You need to enter an e-mail address.');
      email.reportValidity();
    } else if (!password.value) {
      password.setCustomValidity('You need to enter a password.');
      password.reportValidity();
    }
    event.preventDefault();
  }
});
