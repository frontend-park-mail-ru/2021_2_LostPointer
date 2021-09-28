export class Component {
  constructor(config) {
    this.template = config.template;
    this.selector = config.selector;
    this.components = config.components;
    this.data = config.data;
  }

  render() {
    this.el = document.querySelector(`div.${this.selector}`);
    if (this.el) {
      this.el.innerHTML = this.compileTemplate(this.template, this.data);
    }
    if (this.components) {
      this.components.forEach((c) => (c.render()));
    }
  }

  compileTemplate(html, data) {
    if (data === undefined) return html;

    // eslint-disable-next-line no-undef
    const template = Handlebars.compile(html);
    return template(data);
  }
}
