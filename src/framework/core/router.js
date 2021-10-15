import { PATH_ARG, PATH_SLASH } from './regex.js';
import { AppComponent } from '../../app/AppComponent.js';
// eslint-disable-next-line import/no-cycle
import { SignupComponent } from '../../app/SignupComponent.js';
// eslint-disable-next-line import/no-cycle
import { SigninComponent } from '../../app/SigninComponent.js';
// eslint-disable-next-line import/no-cycle
import { ProfileView } from '../../app/ProfileView.js';

const pathToRegex = (path) => new RegExp(`^${path.replace(PATH_SLASH, '\\/').replace(PATH_ARG, '(.+)')}$`);

let currentView = null;

export const router = () => {
  const routes = [
    { path: '/', view: new AppComponent() },
    { path: '/profile', view: new ProfileView() },
    { path: '/signin', view: new SigninComponent() },
    { path: '/signup', view: new SignupComponent() },
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

  matches.route.view.render();
  if (currentView) {
    currentView.unmount();
  }
  currentView = matches.route.view;
};

export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};
