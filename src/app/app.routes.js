import { appComponent } from './app.component.js';
import { signinComponent, signupComponent } from './auth.component.js';

export const appRoutes = [
  { path: '/', component: appComponent },
  { path: '/signin', component: signupComponent },
  { path: '/signup', component: signinComponent },
];
