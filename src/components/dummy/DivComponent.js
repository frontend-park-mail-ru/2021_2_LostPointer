class DivComponent {
  constructor(className, content) {
    this.el = document.createElement('div');
    this.el.classList.add(className);
    content.forEach((item) => {
      this.el.appendChild(item.el);
    });
  }
}

export default DivComponent;
