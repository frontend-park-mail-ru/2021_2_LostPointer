import { PATH_ARG, PATH_ARG_CG, PATH_SLASH } from './regex.js';

class Router {
  constructor() {
    this.routes = [];
  }

  register(path, view) {
    this.routes.push({
      path,
      view,
    });
    return this;
  }

  _pathToRegex(path) {
    return new RegExp(`^${path.replace(PATH_SLASH, '\\/').replace(PATH_ARG, '(.+)')}$`);
  }

  _getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(PATH_ARG_CG)).map((result) => result[1]);

    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  }

  _getView() {
    const potentialMatches = this.routes.map((route) => ({
      route,
      result: window.location.pathname.match(this._pathToRegex(route.path)),
    }));
    let matches = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);
    if (!matches) {
      matches = {
        route: this.routes[0],
        result: [window.location.pathname],
      };
    }
    const ViewClass = matches.route.view;
    return new ViewClass(this._getParams(matches));
  }

  route() {
    this._getView().render();
  }

  go(path) {
    window.history.pushState(null, null, path);
    this.route();
  }

  start() {
    window.addEventListener('popstate', this.route.bind(this));
    return this;
  }
}

export default new Router();
