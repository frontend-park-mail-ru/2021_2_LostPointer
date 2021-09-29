export class Component {
  constructor(props) {
    if (props) {
      this.data = props.data;
    }
  }

  render() {
    if (this.data === undefined) {
      return this.template;
    }
    // eslint-disable-next-line no-undef
    const template = Handlebars.compile(this.template);
    return template(this.data);
  }
}
