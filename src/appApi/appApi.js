import { ContentType, AppApiMethods, createURL } from './appApiUtils';

const defaultBackendDomain = 'http://lostpointer.site';

export class AppApi {
  constructor(domain = defaultBackendDomain) {
    this.backendDomain = domain;
  }

  post(path, requestBody, contentType) {
    return this._fetchRequest(createURL(this.backendDomain, path),
      AppApiMethods.POST, requestBody, contentType);
  }

  put(path, requestBody, contentType) {
    return this._fetchRequest(createURL(this.backendDomain, path),
      AppApiMethods.PUT, requestBody, contentType);
  }

  get(path) {
    return this._fetchRequest(createURL(this.backendDomain, path), AppApiMethods.GET);
  }

  delete(path) {
    return this._fetchRequest(createURL(this.backendDomain, path), AppApiMethods.DELETE);
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
      .then(async (response) => {
        const { status } = response;
        const body = await response.json();
        return {
          Status: status,
          Body: body,
        };
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error));
  }
}
