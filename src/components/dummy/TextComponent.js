class TextComponent {
  constructor(className, text) {
    this.el = document.createElement('div');
    this.el.classList.add(className);
    this.el.innerText = text;
  }
}

export default TextComponent;
