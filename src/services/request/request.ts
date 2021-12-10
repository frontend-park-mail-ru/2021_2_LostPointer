import { ContentType, RequestMethods } from './requestUtils';

const defaultBackendDomain = 'https://api.lostpointer.site/api/v1';

export interface IResponseBody {
    status: number;
    message: string;
}

export class Request {
    private readonly backendDomain: string;

    constructor(domain: string = defaultBackendDomain) {
        this.backendDomain = domain;
    }

    patch(
        path: string,
        requestBody?: BodyInit,
        contentType?: string,
        customHeaders?: object
    ) {
        return this._fetchRequest(
            this._createURL(this.backendDomain, path),
            RequestMethods.PATCH,
            requestBody,
            contentType,
            customHeaders
        );
    }

    post(path: string, requestBody?: BodyInit, contentType?: string) {
        return this._fetchRequest(
            this._createURL(this.backendDomain, path),
            RequestMethods.POST,
            requestBody,
            contentType
        );
    }

    put(path: string, requestBody?: BodyInit, contentType?: string) {
        return this._fetchRequest(
            this._createURL(this.backendDomain, path),
            RequestMethods.PUT,
            requestBody,
            contentType
        );
    }

    get(path: string) {
        return this._fetchRequest(
            this._createURL(this.backendDomain, path),
            RequestMethods.GET
        );
    }

    delete(path: string, requestBody?: BodyInit, contentType?: string) {
        return this._fetchRequest(
            this._createURL(this.backendDomain, path),
            RequestMethods.DELETE,
            requestBody,
            contentType
        );
    }

    _fetchRequest(
        url: string,
        requestMethod: string,
        requestBody: BodyInit = null,
        contentType: string = ContentType.JSON,
        customHeaders = null
    ) {
        const myHeaders = new Headers();
        if (
            !!requestBody &&
            // потому что FormData сам проставляет нужный content type
            contentType !== ContentType.FORM &&
            (RequestMethods.POST === requestMethod ||
                RequestMethods.PUT === requestMethod ||
                RequestMethods.DELETE === requestMethod ||
                RequestMethods.PATCH)
        ) {
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
        }).then((response) => response.json());
    }

    _createURL(domain: string, path: string): string {
        return domain + path;
    }
}

export default new Request();
