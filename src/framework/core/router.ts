import { PATH_ARG, PATH_SLASH } from './regex';
// eslint-disable-next-line import/no-cycle
import { AppComponent } from '../../components/app/app';
// eslint-disable-next-line import/no-cycle
import { SignupComponent } from '../../components/signupcomponent/signupcomponent';
// eslint-disable-next-line import/no-cycle
import { SigninComponent } from '../../components/signincomponent/signincomponent';

const pathToRegex = (path) => new RegExp(`^${path.replace(PATH_SLASH, '\\/').replace(PATH_ARG, '(.+)')}$`);

let currentView = null;

export const router = () => {
  const routes = [
    { path: '/', view: new AppComponent(null) },
    { path: '/signin', view: new SigninComponent(null) },
    { path: '/signup', view: new SignupComponent(null) },
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

  if (currentView) {
    currentView.unmount();
  }
  currentView = matches.route.view;
  matches.route.view.render();
};

export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};
