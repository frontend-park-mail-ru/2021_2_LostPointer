class InputComponent {
  constructor(className, id, type, placeholder = null) {
    this.el = document.createElement('input');
    this.el.classList.add(className);
    this.el.id = id;
    this.el.setAttribute('type', type);
    if (placeholder) {
      this.el.setAttribute('placeholder', placeholder);
    }
  }
}

export default InputComponent;
