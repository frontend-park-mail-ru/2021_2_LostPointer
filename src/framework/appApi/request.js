import { ContentType, RequestMethods } from './requestUtils.js';

const defaultBackendDomain = '/api/v1';

class Request {
  constructor(domain = defaultBackendDomain) {
    this.backendDomain = domain;
  }

  patch(path, requestBody, contentType, customHeaders) {
    return this._fetchRequest(this._createURL(this.backendDomain, path),
      RequestMethods.PATCH, requestBody, contentType, customHeaders);
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

  _fetchRequest(
    url,
    requestMethod,
    requestBody = null,
    contentType = ContentType.JSON,
    customHeaders = null,
  ) {
    const myHeaders = new Headers();
    if (!!requestBody && ((RequestMethods.POST === requestMethod)
      || (RequestMethods.PUT === requestMethod))) {
      myHeaders.append('Content-Type', contentType);
    }
    if (customHeaders) {
      Object.keys(customHeaders).forEach((key) => {
        myHeaders.append(key, customHeaders[key]);
      });
    }

    return fetch(url, {
      method: requestMethod,
      mode: 'cors',
      credentials: 'include',
      headers: myHeaders,
      body: requestBody,
    })
      .then((response) => response.json()
        .then((responseBody) => ({
          status: response.status,
          body: responseBody,
        })))
      .catch((error) => console.log(error));
  }

  _createURL(domain, path) {
    return domain + path;
  }
}

export default new Request();
