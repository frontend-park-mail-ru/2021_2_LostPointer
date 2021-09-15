export function ajax(method, url, body = null, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;

    callback(xhr.status, xhr.responseText);
  });

  if (body) {
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
    xhr.send(JSON.stringify(body));
    return;
  }

  xhr.send();
}

export function addEmailListener(email) {
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
}

export function addPasswordListener(password) {
  password.addEventListener('input', () => {
    if (!password.value) {
      password.setCustomValidity('You need to enter a password.');
    } else if (password.validity.patternMismatch) {
      password.setCustomValidity('Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.');
    } else {
      password.setCustomValidity('');
    }
  });
}

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
      '/login',
      {
        email: email.value.trim(),
        password: password.value.trim(),
      },
      (status) => {
        if (status === 200) {
          // перенаправляем на страницу профиля
        }
      },
    );
  } else if (!email.value) {
    email.setCustomValidity('You need to enter an e-mail address.');
    email.reportValidity();
  } else if (!password.value) {
    password.setCustomValidity('You need to enter a password.');
    password.reportValidity();
  }
});
