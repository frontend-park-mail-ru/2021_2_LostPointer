import {
  router,
  navigateTo,
} from './router.js';
import Request from '../appApi/request.js';

class App {
  start() {
    this.initRoutes();
  }

  initRoutes() {
    window.addEventListener('popstate', router);
    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]') && (e.target.matches('[href="/user/logout"]'))) {
          Request.post('/user/logout')
            .then(({ status }) => {
              console.log(status);
              if (status === 200) {
                navigateTo('/signin');
                console.log('navigating');
              }
            })
            .catch((error) => console.log(error.msg));
        } else if (e.target.matches('[data-link]')) {
          e.preventDefault();
          navigateTo(e.target.getAttribute('href'));
        }
      });
      router();
    });
  }
}

const app = new App();

function startApp() {
  app.start();
}
export default startApp;
