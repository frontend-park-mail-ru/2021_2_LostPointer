import { PATH_ARG, PATH_SLASH, PATH_ARG_CG } from './regex.js';
// eslint-disable-next-line import/no-cycle
import { AppComponent } from '../../app/AppComponent.js';
// eslint-disable-next-line import/no-cycle
import { SignupComponent } from '../../app/SignupComponent.js';
// eslint-disable-next-line import/no-cycle
import { SigninComponent } from '../../app/SigninComponent.js';
import { ProfileView } from '../../app/ProfileView.js';

const pathToRegex = (path) => new RegExp(`^${path.replace(PATH_SLASH, '\\/').replace(PATH_ARG, '(.+)')}$`);

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(PATH_ARG_CG)).map((result) => result[1]);

  return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
};

export const router = () => {
  const routes = [
    { path: '/', view: AppComponent },
    { path: '/profile', view: ProfileView },
    { path: '/signin', view: SigninComponent },
    { path: '/signup', view: SignupComponent },
  ];

  const potentialMatches = routes.map((route) => ({
    route,
    result: window.location.pathname.match(pathToRegex(route.path)),
  }));

  let matches = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

  if (!matches) {
    matches = {
      route: routes[0],
      result: [window.location.pathname],
    };
  }

  const ViewClass = matches.route.view;
  const view = new ViewClass(getParams(matches));
  view.render();
};

export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};
