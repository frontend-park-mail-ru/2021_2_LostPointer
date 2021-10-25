import {PATH_ARG, PATH_ARG_CG, PATH_SLASH} from 'store/regex';
import {Component} from "components/Component/component";

interface IRoute {
  path: string;
  view: Component<never>;
}

class Router {
  private routes: IRoute[];
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

  _pathToRegex(path: string): RegExp {
    return new RegExp(`^${path.replace(PATH_SLASH, '\\/').replace(PATH_ARG, '(.+)')}$`);
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
    return matches.route.view;
  }

  route() {
    this._getView().render();
  }

  go(path: string): void {
    window.history.pushState(null, null, path);
    this.route();
  }

  start() {
    window.addEventListener('popstate', this.route.bind(this));
    return this;
  }
}

export default new Router();
