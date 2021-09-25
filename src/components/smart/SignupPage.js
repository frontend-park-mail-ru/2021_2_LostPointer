import ImgComponent from '../dummy/ImgComponent.js';
import DivComponent from '../dummy/DivComponent.js';
import TextComponent from '../dummy/TextComponent.js';
import AuthFormComponent from '../dummy/AuthFormComponent.js';
import InputComponent from '../dummy/InputComponent.js';
import ButtonComponent from '../dummy/ButtonComponent.js';

class SignupPage {
  constructor(className) {
    this.el = document.createElement('div');
    this.el.classList.add(className);
    this.content = [
      new ImgComponent(
        `${className}__placeholder`,
        'photo',
        '/src/static/img/woman_headphones_1.jpeg',
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
            'Sign up',
          ),
          new TextComponent(
            `${className}__description`,
            'Let’s get all your required setup information and get started',
          ),
          new AuthFormComponent(
            'auth-form',
            'auth-form',
            [
              new InputComponent(
                'auth-form__input',
                'name',
                'text',
                'Name',
              ),
              new InputComponent(
                'auth-form__input',
                'email',
                'text',
                'Email',
              ),
              new InputComponent(
                'auth-form__input',
                'password',
                'text',
                'Password',
              ),
              new InputComponent(
                'auth-form__input',
                'confirm_password',
                'text',
                'Confirm password',
              ),
              new ButtonComponent(
                'auth-form__submit',
                'Sign in',
              ),
              new ButtonComponent(
                'auth-form__submit',
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

export default SignupPage;
