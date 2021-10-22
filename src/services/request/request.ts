import { ContentType, RequestMethods } from './requestUtils';

const defaultBackendDomain = '/api/v1';

export class Request {
  private readonly backendDomain: string;

  constructor(domain: string = defaultBackendDomain) {
    this.backendDomain = domain;
  }

  post(path: string, requestBody?: BodyInit, contentType?: string) {
    return this._fetchRequest(this._createURL(this.backendDomain, path),
      RequestMethods.POST, requestBody, contentType);
  }

  put(path: string, requestBody?: BodyInit, contentType?: string) {
    return this._fetchRequest(this._createURL(this.backendDomain, path),
      RequestMethods.PUT, requestBody, contentType);
  }

  get(path: string) {
    return this._fetchRequest(this._createURL(this.backendDomain, path), RequestMethods.GET);
  }

  delete(path: string) {
    return this._fetchRequest(this._createURL(this.backendDomain, path), RequestMethods.DELETE);
  }

  _fetchRequest(url: string, requestMethod: string, requestBody: BodyInit = null, contentType:string = ContentType.JSON) {
    const myHeaders = new Headers();
    if (!!requestBody && ((RequestMethods.POST === requestMethod)
      || (RequestMethods.PUT === requestMethod))) {
      myHeaders.append('Content-Type', contentType);
    }

    return fetch(url, {
      method: requestMethod,
      mode: 'cors',
      credentials: 'include',
      headers: myHeaders,
      body: requestBody,
    })
      .then((response) => response.json());
  }

  _createURL(domain: string, path: string): string {
    return domain + path;
  }
}

export default new Request();
