import startApp from './framework/core/app.js';

Handlebars.registerHelper('render', (component) => component.getHtml());

startApp();
