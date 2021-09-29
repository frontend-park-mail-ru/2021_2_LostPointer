import { PATH_ARG, PATH_SLASH, PATH_ARG_CG } from './regex.js';
import { appComponent } from '../../app/app.component.js';
import { signupComponent } from '../../app/auth.signupcomponent.js';
import { signinComponent } from '../../app/auth.signincomponent.js';

const pathToRegex = (path) => new RegExp(`^${path.replace(PATH_SLASH, '\\/').replace(PATH_ARG, '(.+)')}$`);

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(PATH_ARG_CG)).map((result) => result[1]);

  return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
};

export const router = () => {
  const routes = [
    { path: '/', view: appComponent },
    { path: '/signin', view: signinComponent },
    { path: '/signup', view: signupComponent },
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

  document.querySelector('.app').innerHTML = view.html;
};

export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};
