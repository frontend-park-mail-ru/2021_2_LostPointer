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

export function createURL(domain, path) {
  return domain + path;
}
