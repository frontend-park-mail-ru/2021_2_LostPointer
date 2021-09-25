class ImgComponent {
  empl() {
    if (this.dataLink) {
      return `
        <img class="${this.className}-${this.imgClassSuffix}" data-link href="${this.dataLink}" src="${this.src}">
      `;
    }
    return `
        <img class="${this.className}-${this.imgClassSuffix}" src="${this.src}">
    `;
  }

  constructor(className, imgClassSuffix, src, dataLink = null) {
    this.el = document.createElement('div');
    this.className = className;
    this.el.classList.add(className);
    this.imgClassSuffix = imgClassSuffix;
    this.src = src;
    this.dataLink = dataLink;
    this.el.innerHTML = this.empl();
  }
}

export default ImgComponent;
