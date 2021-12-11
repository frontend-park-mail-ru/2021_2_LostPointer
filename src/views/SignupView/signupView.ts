import { SignupAuthForm } from 'components/SignupForm/signupform';
import {
    addInputsEventListeners,
    CustomValidation,
    isValidForm,
    removeInputsEventListeners,
} from 'services/validation/validation';
import router from 'services/router/router';
import {
    confirmPasswordValidityChecks,
    emailValidityChecks,
    nameValidityChecks,
    passwordValidityChecks,
} from 'services/validation/validityChecks';
import { ICustomInput } from 'interfaces/CustomInput';
import routerStore from 'services/router/routerStore';
import { View } from 'views/View/view';

import SignupComponentTemplate from './signupView.hbs';
import './signupView.scss';
import { UserModel } from 'models/user';
import store from 'services/store/store';
import baseView from 'views/BaseView/baseView';

interface ISignupComponentProps {
    placeholder_img: string;
    title: string;
    description: string;
    form: string;
}

export class SignupView extends View<ISignupComponentProps> {
    constructor() {
        super();
        this.props = {
            placeholder_img: 'woman_headphones_1.webp',
            title: 'Sign up',
            description:
                'Let’s get all your required setup information and get started',
            form: new SignupAuthForm().render(),
        };
    }

    didMount(): void {
        throw new Error('Method not implemented.');
    }

    render() {
        baseView.unmount();
        if (store.get('authenticated')) {
            router.go(routerStore.dashboard);
            return;
        }
        document.getElementById('app').innerHTML = SignupComponentTemplate(
            this.props
        );

        const form = document.querySelector('.auth-form');
        const nicknameInput = form.querySelector('input[name="nickname"]');
        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const confirmPasswordInput = form.querySelector(
            'input[name="confirm_password"]'
        );
        const invalidities = document.querySelector('.auth-form__invalidities');

        (<ICustomInput>nicknameInput).CustomValidation = new CustomValidation(
            nameValidityChecks,
            invalidities
        );
        (<ICustomInput>emailInput).CustomValidation = new CustomValidation(
            emailValidityChecks,
            invalidities
        );
        (<ICustomInput>passwordInput).CustomValidation = new CustomValidation(
            passwordValidityChecks,
            invalidities
        );
        (<ICustomInput>confirmPasswordInput).CustomValidation =
            new CustomValidation(confirmPasswordValidityChecks, invalidities);

        addInputsEventListeners(form);
        form.addEventListener('submit', this.submitSignupForm);
    }

    unmount() {
        const form = document.querySelector('.auth-form');
        if (form) {
            form.removeEventListener('submit', this.submitSignupForm);
            removeInputsEventListeners(form);
        }
    }

    submitSignupForm(event) {
        event.preventDefault();
        const inputs = event.target.querySelectorAll('.auth-form__input');
        const errorsField = document.querySelector('.auth-form__fail_msg');
        errorsField.innerHTML = '&nbsp;';

        if (!isValidForm(inputs.length)) {
            errorsField.classList.add('visible');
            return;
        }
        const nicknameInput = event.target.querySelector(
            'input[name="nickname"]'
        );
        const emailInput = event.target.querySelector('input[name="email"]');
        const passwordInput = event.target.querySelector(
            'input[name="password"]'
        );

        UserModel.signup({
            nickname: nicknameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
        })
            .then((body) => {
                if (body.status === 201) {
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
            .catch((error) => {
                const failMsg = event.target.querySelector(
                    '.auth-form__fail_msg'
                );
                failMsg.innerText = error.message;
                failMsg.classList.add('visible');
            });
    }
}

export default new SignupView();
