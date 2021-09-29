import startApp from './framework/core/app.js';

// eslint-disable-next-line no-undef,new-cap
Handlebars.registerHelper('render', (component) => component.render());

startApp();
