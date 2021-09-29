export class Component {
  constructor(props) {
    if (props) {
      this.data = props.data;
    }
  }

  getHtml() {
    if (this.data === undefined) {
      return this.template;
    }
    // eslint-disable-next-line no-undef
    const template = Handlebars.compile(this.template);
    return template(this.data);
  }

  render() {
    document.querySelector('.app').innerHTML = this.getHtml();
  }
}
