import router from './router.js';
import { AppComponent } from '../../app/AppComponent.js';
import { SigninComponent } from '../../app/SigninComponent.js';
import { SignupComponent } from '../../app/SignupComponent.js';

class App {
  start() {
    this.initRoutes();
  }

  initRoutes() {
    router
      .register('/', AppComponent)
      .register('/signin', SigninComponent)
      .register('/signup', SignupComponent)
      .start();

    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]')) {
          e.preventDefault();
          router.go(e.target.getAttribute('href'));
        }
      });
      router.check();
    });
  }
}

const app = new App();

function startApp() {
  app.start();
}
export default startApp;
