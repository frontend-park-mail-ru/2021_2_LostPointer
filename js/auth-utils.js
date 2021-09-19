export async function ajax(method, url, body = null) {
  // eslint-disable-next-line no-return-await
  return await fetch('/article/fetch/post/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(body),
    credentials: 'same-origin',
  });
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

export function checkValidity(element, error) {
  if (!element.value || !element.validity.valid) {
    element.setCustomValidity(error);
    element.reportValidity();
    return false;
  }
  return true;
}
