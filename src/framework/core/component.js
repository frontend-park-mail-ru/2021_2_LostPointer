export class Component {
  constructor(config) {
    this.template = config.template;
    this.selector = config.selector;
    this.components = config.components;
    this.el = null;
  }

  render() {
    this.el = document.querySelector(`div.${this.selector}`);
    if (this.el) {
      this.el.innerHTML = this.template;
    }
    if (this.components) {
      this.components.forEach((c) => (c.render()));
    }
  }
}
