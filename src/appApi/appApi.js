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
    // eslint-disable-next-line no-underscore-dangle
    return this._fetchRequest(url, AppApiMethods.POST, requestBody, contentType);
  }

  put(url, requestBody, contentType) {
    // eslint-disable-next-line no-underscore-dangle
    return this._fetchRequest(url, AppApiMethods.PUT, requestBody, contentType);
  }

  get(url) {
    // eslint-disable-next-line no-underscore-dangle
    return this._fetchRequest(url, AppApiMethods.GET);
  }

  delete(url) {
    // eslint-disable-next-line no-underscore-dangle
    return this._fetchRequest(url, AppApiMethods.DELETE);
  }

  // eslint-disable-next-line no-underscore-dangle,class-methods-use-this
  _fetchRequest(url, requestMethod, requestBody = '', contentType = ContentType.JSON) {
    const myHeaders = new Headers();
    if ((AppApiMethods.POST === requestMethod) || (AppApiMethods.PUT === requestMethod)) {
      myHeaders.append('Content-Type', contentType);
    }

    return fetch(url, {
      method: requestMethod,
      mode: 'cross-origin',
      credentials: 'same-origin',
      headers: myHeaders,
      body: requestBody,
    })
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error));
  }
}
