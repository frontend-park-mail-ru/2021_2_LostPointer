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

function setValidityReport(element, msg) {
  element.setCustomValidity(msg);
  element.reportValidity();
}

export function checkName(element) {
  if (!element.value) {
    setValidityReport(element, 'You need to enter a name.');
    return false;
  }
  if (element.validity.tooShort) {
    setValidityReport(element, 'Must contain at least 5 or more characters.');
    return false;
  }
  element.setCustomValidity('');
  return true;
}

export function checkEmail(element) {
  if (!element.value) {
    setValidityReport(element, 'You need to enter an e-mail address.');
    return false;
  }
  if (element.validity.typeMismatch || element.validity.patternMismatch) {
    setValidityReport(element, 'Entered value needs to be an e-mail address.');
    return false;
  }
  element.setCustomValidity('');
  return true;
}

export function checkPassword(element) {
  if (!element.value) {
    setValidityReport(element, 'You need to enter a password.');
    return false;
  }
  if (element.validity.patternMismatch) {
    setValidityReport(element, 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.');
    return false;
  }
  element.setCustomValidity('');
  return true;
}

export function checkConfirmPassword(element, password) {
  if (!element.value || element.value !== password) {
    setValidityReport(element, 'You need to confirm a password.');
  }
  element.setCustomValidity('');
  return true;
}
