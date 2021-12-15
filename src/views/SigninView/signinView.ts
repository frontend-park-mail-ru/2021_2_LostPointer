import { SigninAuthForm } from 'components/SigninForm/signinform';
import {
    addInputsEventListeners,
    CustomValidation,
    isValidForm,
    removeInputsEventListeners,
} from 'services/validation/validation';
import {
    emailValidityChecks,
    simplePasswordValidityChecks,
} from 'services/validation/validityChecks';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { ICustomInput } from 'interfaces/CustomInput';
import { View } from 'views/View/view';

import SigninComponentTemplate from './signinView.hbs';
import './signinView.scss';
import { UserModel } from 'models/user';
import store from 'services/store/store';
import baseView from 'views/BaseView/baseView';

interface ISigninComponentProps {
    placeholder_img: string;
    title: string;
    description: string;
    form: string;
}

export class SigninView extends View<ISigninComponentProps> {
    constructor() {
        super();
        this.props = {
            placeholder_img: 'woman_headphones_2.webp',
            title: 'Sign in',
            description: 'Let’s get all required data and sign in',
            form: new SigninAuthForm().render(),
        };
    }

    render() {
        baseView.unmount();
        if (store.get('authenticated')) {
            router.go(routerStore.dashboard);
            return;
        }
        document.getElementById('app').innerHTML = SigninComponentTemplate(
            this.props
        );
        const form = document.querySelector('.auth-form');
        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const invalidities = document.querySelector('.auth-form__invalidities');

        (<ICustomInput>emailInput).CustomValidation = new CustomValidation(
            emailValidityChecks,
            invalidities
        );
        (<ICustomInput>passwordInput).CustomValidation = new CustomValidation(
            simplePasswordValidityChecks,
            invalidities
        );

        addInputsEventListeners(form);
        form.addEventListener('submit', this.submitSigninForm);
    }

    unmount() {
        const form = document.querySelector('.auth-form');
        if (form) {
            form.removeEventListener('submit', this.submitSigninForm);
            removeInputsEventListeners(form);
        }
    }

    submitSigninForm(event) {
        event.preventDefault();
        const inputs = event.target.querySelectorAll('.auth-form__input');
        const errorsField = document.querySelector('.auth-form__fail_msg');
        errorsField.innerHTML = '&nbsp;';

        if (!isValidForm(inputs.length)) {
            errorsField.classList.add('visible');
            return;
        }
        const emailInput = event.target.querySelector('input[name="email"]');
        const passwordInput = event.target.querySelector(
            'input[name="password"]'
        );

        UserModel.signin({
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
        })
            .then((body) => {
                if (body.status === 200) {
                    // TODO=Сделать ответ бэка полезным
                    UserModel.auth().then((authResponse) => {
                        store.set('authenticated', authResponse.authenticated);
                        store.set('userAvatar', authResponse.avatar);
                        router.go(routerStore.dashboard);
                    });
                } else {
                    const failMsg = event.target.querySelector(
                        '.auth-form__fail_msg'
                    );
                    failMsg.innerText = body.message;
                    failMsg.classList.add('visible');
                }
            })
            .catch(() => {
                const failMsg = event.target.querySelector(
                    '.auth-form__fail_msg'
                );
                failMsg.innerText = 'Authentication failed';
                failMsg.classList.add('visible');
            });
    }
}

export default new SigninView();
