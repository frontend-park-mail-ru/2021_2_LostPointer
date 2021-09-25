class ButtonComponent {
  constructor(className, text, dataLink = null) {
    this.el = document.createElement('input');
    this.el.classList.add(className);
    this.el.setAttribute('type', 'submit');
    this.el.innerText = text;
    if (dataLink) {
      this.el.setAttribute('data-link', '');
      this.el.setAttribute('href', dataLink);
    }
  }
}

export default ButtonComponent;
