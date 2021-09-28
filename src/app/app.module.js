import { FWModule } from '../framework/index.js';
import { appRoutes } from './app.routes.js';

class AppModule extends FWModule {
}

export const appModule = new AppModule({
  routes: appRoutes,
});
