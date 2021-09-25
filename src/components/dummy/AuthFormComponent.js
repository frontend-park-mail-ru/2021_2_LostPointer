class AuthFormComponent {
  constructor(className, id, content) {
    this.el = document.createElement('form');
    this.el.classList.add(className);
    this.el.id = id;
    this.el.setAttribute('action', '#');
    this.content = content;
    this.content.forEach((item) => {
      this.el.appendChild(item.el);
    });
  }
}

export default AuthFormComponent;
