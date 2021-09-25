// eslint-disable-next-line import/extensions
import { ContentType, AppApiMethods } from './appApiUtils';

const defaultBackendURL = 'http://lostpointer.site';

// eslint-disable-next-line import/prefer-default-export
export class AppApi {
  AppApi(backendURL = defaultBackendURL) {
    this.backendURL = backendURL;
  }

  post(url, requestBody, contentType) {
    return this._fetchRequest(defaultBackendURL + url,
      AppApiMethods.POST, requestBody, contentType);
  }

  put(url, requestBody, contentType) {
    return this._fetchRequest(defaultBackendURL + url,
      AppApiMethods.PUT, requestBody, contentType);
  }

  get(url) {
    return this._fetchRequest(defaultBackendURL + url, AppApiMethods.GET);
  }

  delete(url) {
    return this._fetchRequest(defaultBackendURL + url, AppApiMethods.DELETE);
  }

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
      .then((response) => ({
        Status: response.status,
        Body: response.json,
      }))
      .catch((error) => error);
  }
}
