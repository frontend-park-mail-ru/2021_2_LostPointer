import { ContentType, RequestMethods } from './requestUtils.js';

const defaultBackendDomain = 'http://lostpointer.site';

export class Request {
  constructor(domain = defaultBackendDomain) {
    this.backendDomain = domain;
  }

  post(path, requestBody, contentType) {
    return this._fetchRequest(this._createURL(this.backendDomain, path),
      RequestMethods.POST, requestBody, contentType);
  }

  put(path, requestBody, contentType) {
    return this._fetchRequest(this._createURL(this.backendDomain, path),
      RequestMethods.PUT, requestBody, contentType);
  }

  get(path) {
    return this._fetchRequest(this._createURL(this.backendDomain, path), RequestMethods.GET);
  }

  delete(path) {
    return this._fetchRequest(this._createURL(this.backendDomain, path), RequestMethods.DELETE);
  }

  _fetchRequest(url, requestMethod, requestBody = '', contentType = ContentType.JSON) {
    const myHeaders = new Headers();
    if ((RequestMethods.POST === requestMethod) || (RequestMethods.PUT === requestMethod)) {
      myHeaders.append('Content-Type', contentType);
    }

    return fetch(url, {
      method: requestMethod,
      mode: 'same-origin',
      credentials: 'same-origin',
      headers: myHeaders,
      body: requestBody,
    })
      .then((response) => response.json()
        .then((body) => ({
          Status: response.status,
          Body: body,
        })))
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error));
  }

  _createURL(domain, path) {
    return domain + path;
  }
}

export default new Request();
