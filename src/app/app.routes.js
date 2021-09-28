import { appComponent } from './app.component.js';
import { signinComponent } from './auth.signincomponent.js';
import { signupComponent } from './auth.signupcomponent.js';

export const appRoutes = [
  { path: '/', component: appComponent },
  { path: '/signin', component: signupComponent },
  { path: '/signup', component: signinComponent },
];
