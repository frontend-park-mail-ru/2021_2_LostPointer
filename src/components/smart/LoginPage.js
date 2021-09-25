import ImgComponent from '../dummy/ImgComponent.js';
import DivComponent from '../dummy/DivComponent.js';
import TextComponent from '../dummy/TextComponent.js';
import AuthFormComponent from '../dummy/AuthFormComponent.js';
import InputComponent from '../dummy/InputComponent.js';
import ButtonComponent from '../dummy/ButtonComponent.js';

class LoginPage {
  constructor(className) {
    this.el = document.createElement('div');
    this.el.classList.add(className);
    this.content = [
      new ImgComponent(
        `${className}__placeholder`,
        'photo',
        '/src/static/img/woman_headphones_2.png',
        '/',
      ),
      new DivComponent(
        `${className}__content`,
        [
          new ImgComponent(
            `${className}__logo`,
            'image',
            '/src/static/img/Logo.png',
            '/',
          ),
          new TextComponent(
            `${className}__title`,
            'Sign in',
          ),
          new TextComponent(
            `${className}auth-page__description`,
            'Let’s get all required data and sign in',
          ),
          new AuthFormComponent(
            'auth-form',
            [
              new InputComponent(
                `${className}__input`,
                'email',
                'text',
                'Email',
              ),
              new InputComponent(
                `${className}__input`,
                'password',
                'text',
                'Password',
              ),
              new ButtonComponent(
                `${className}__submit`,
                'Sign in',
              ),
              new ButtonComponent(
                `${className}__submit`,
                'Sign up',
                '/signup',
              ),
            ],
          ),
        ],
      ),
    ];
    this.content.forEach((item) => {
      this.el.appendChild(item.el);
    });
  }

  render() {
    return this.el.outerHTML;
  }
}

export default LoginPage;
