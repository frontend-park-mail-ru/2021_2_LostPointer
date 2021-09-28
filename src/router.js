// import SigninView from '../views/signup/signin.js';
// import SignupView from '../views/signup/signup.js';
// import DashboardView from '../views/dashboard/dashboard.js';
import { PATH_ARG, PATH_SLASH } from './regex.js';

const pathToRegex = (path) => new RegExp(`^${path.replace(PATH_SLASH, '\\/').replace(PATH_ARG, '(.+)')}$`);

// const getParams = (match) => {
//   const values = match.result.slice(1);
//   const keys = Array.from(match.route.path.matchAll(PATH_ARG_CG)).map((result) => result[1]);
//
//   return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
// };

const router = (routes) => {
  // const routes = [
  //   { path: '/', view: DashboardView },
  //   { path: '/signin', view: SigninView },
  //   { path: '/signup', view: SignupView },
  // ];

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

  return matches.route.component;
  //
  // const ViewClass = matches.route.view;
  // const view = new ViewClass(getParams(matches));
  //
  // document.querySelector('.app').innerHTML = view.html;
};

export default router;
