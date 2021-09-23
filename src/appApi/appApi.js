const defaultBackendURL = 'defaultURL';

export const ContentType = {
  JSON: 'application/json',
  IMG: {
    IMG_JPEG: 'image/jpeg',
    IMG_PNG: 'image/png',
    IMG_SVG: 'image/svg+xml',
  },
  FORM: 'multipart/form-data',
};

export const AppApiMethods = {
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE',
};

export class AppApi {
  AppApi(backendURL = defaultBackendURL) {
    this.backendURL = backendURL;
  }

  post(url, requestBody, contentType) {
    return this._fetchRequest(url, AppApiMethods.POST, requestBody, contentType);
  }

  put(url, requestBody, contentType) {
    return this._fetchRequest(url, AppApiMethods.PUT, requestBody, contentType);
  }

  get(url) {
    return this._fetchRequest(url, AppApiMethods.GET);
  }

  delete(url) {
    return this._fetchRequest(url, AppApiMethods.DELETE);
  }

  _fetchRequest(url, method, requestBody = '', contentType = ContentType.JSON) {
    const myHeaders = new Headers();
    if ((AppApiMethods.POST === method) || (AppApiMethods.PUT === method)) {
      myHeaders.append('Content-Type', contentType);
    }

    return fetch(url, {
      method: method,
      mode: 'cross-origin',
      credentials: 'same-origin',
      headers: myHeaders,
      body: requestBody,
    })
      .then((response) => response.json());
    /* .catch((error) => {
        console.log(error) гуглил насчет json() как я понял он в любом случае вернет объект
      }); */
  }
}
