class Api {
  // eslint-disable-next-line class-methods-use-this
  postJSON(url, requestBody) {
    return fetch(url, {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: requestBody,
    })
      .then((response) => {
        if (response.ok) {
          return response;
        }
        return response.status;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  // eslint-disable-next-line class-methods-use-this
  get(url) {
    return fetch(url, {
      method: 'GET',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    })
      .then((response) => {
        if (response.ok) {
          return response;
        }
        return response.status;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}

export default Api;
