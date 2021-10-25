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

  _getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(PATH_ARG_CG)).map((result) => result[1]);

    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  }

  check() {
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

  start() {
    window.addEventListener('popstate', this.check);
    return this;
  }

  go(path: string): void {
    window.history.pushState(null, null, path);
    window.history.go(0);
  }

  back(): void {
    window.history.back();
  }

  forward(): void {
    window.history.forward();
  }
}

export default new Router();
