import { PATH_ARG, PATH_SLASH } from 'store/regex';
import { View } from 'src/views/View/view';

interface IRoute {
    path: string;
    view: View<never>;
}

class Router {
    private readonly routes: IRoute[];
    private currentView: View<never>;
    constructor() {
        this.routes = [];
        this.currentView = null;
    }

    register(path: string, view) {
        this.routes.push({
            path,
            view,
        });
        return this;
    }

    _pathToRegex(path: string): RegExp {
        return new RegExp(
            `^${path.replace(PATH_SLASH, '\\/').replace(PATH_ARG, '(.+)')}$`
        );
    }

    _getView(): View<never> {
        const potentialMatches = this.routes.map((route) => ({
            route,
            result: window.location.pathname.match(
                this._pathToRegex(route.path)
            ),
        }));
        let matches = potentialMatches.find(
            (potentialMatch) => potentialMatch.result !== null
        );
        if (!matches) {
            matches = {
                route: this.routes[0],
                result: [window.location.pathname],
            };
        }
        return matches.route.view;
    }

    route(): void {
        if (this.currentView && this.currentView.unmount) {
            this.currentView.unmount();
        }
        this.currentView = this._getView();
        this.currentView.render();
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
