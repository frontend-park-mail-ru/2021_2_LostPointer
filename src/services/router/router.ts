import { PATH_ARG, PATH_SLASH } from 'store/regex';
import Index from 'components/IndexView/indexView';
import SignupComponent from 'components/SignupView/signupcomponent';
import SigninComponent from 'components/SigninView/signincomponent';

const pathToRegex = (path) => new RegExp(`^${path.replace(PATH_SLASH, '\\/').replace(PATH_ARG, '(.+)')}$`);

let currentView = null;

export const routerStore = {
  dashboard: '/',
  signin: '/signin',
  signup: '/signup',
};

export const router = () => {
  const routes = [
    { path: '/', view: Index },
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

  if (currentView && currentView.unmount) {
    currentView.unmount();
  }
  currentView = matches.route.view;
  matches.route.view.render();
};

export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};
