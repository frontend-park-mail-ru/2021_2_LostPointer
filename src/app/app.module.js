import { Module } from '../framework/core/module.js';
import { appRoutes } from './app.routes.js';

class AppModule extends Module {
}

export const appModule = new AppModule({
  routes: appRoutes,
});
