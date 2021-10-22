import { Component } from 'components/component/component';
import { SignupAuthForm } from 'components/signupform/signupform';
import { addInputsEventListeners, CustomValidation, isValidForm } from '../../../src/services/validation/validation';
// eslint-disable-next-line import/no-cycle
import { navigateTo } from '../../../src/services/router/router';
import {
    confirmPasswordValidityChecks,
    emailValidityChecks,
    nameValidityChecks,
    passwordValidityChecks,
} from '../../../src/services/validation/validityChecks';
import Request from '../../../src/services/request/request';

import './signupcomponent.scss';

const SignupComponentTemplate = require('./signupcomponent.hbs');

interface ISignupComponentProps {
    placeholder_img: string,
    title: string,
    description: string,
    form: string
}

export class SignupComponent extends Component<ISignupComponentProps> {
    constructor() {
        super();
        this.props = {
            placeholder_img: 'woman_headphones_1.webp',
            title: 'Sign up',
            description: 'Let’s get all your required setup information and get started',
            form: new SignupAuthForm().render(),
        };
    }

    render() {
        document.querySelector('.app').innerHTML = SignupComponentTemplate(this.props);

        const form = document.querySelector('.auth-form');
        const nicknameInput = form.querySelector('input[name="nickname"]');
        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const confirmPasswordInput = form.querySelector('input[name="confirm_password"]');
        const invalidities = document.querySelector('.auth-form__invalidities');

        // @ts-ignore //TODO
        nicknameInput.CustomValidation = new CustomValidation(nameValidityChecks, invalidities);
        // @ts-ignore //TODO
        emailInput.CustomValidation = new CustomValidation(emailValidityChecks, invalidities);
        // @ts-ignore //TODO
        passwordInput.CustomValidation = new CustomValidation(passwordValidityChecks, invalidities);
        // @ts-ignore //TODO
        confirmPasswordInput.CustomValidation = new CustomValidation(
            confirmPasswordValidityChecks, invalidities,
        );

        addInputsEventListeners(form);
        form.addEventListener('submit', this.submitSignupForm);
    }

    submitSignupForm(event) {
        event.preventDefault();
        const errorsField = document.querySelector('.auth-form__fail_msg');
        errorsField.innerHTML = '&nbsp;';

        if (!isValidForm(4)) {
            errorsField.classList.add('visible');
            return;
        }
        const nicknameInput = event.target.querySelector('input[name="nickname"]');
        const emailInput = event.target.querySelector('input[name="email"]');
        const passwordInput = event.target.querySelector('input[name="password"]');

        Request.post(
            '/user/signup',
            JSON.stringify({
                nickname: nicknameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value.trim(),
            }),
            undefined
        )
            .then(({ status, body }) => {
                if (status === 201) {
                    // TODO Переделать navigateTo
                    navigateTo('/');
                } else {
                    const failMsg = event.target.querySelector('.auth-form__fail_msg');
                    failMsg.innerText = body.message;
                    failMsg.classList.add('visible');
                }
            })
            .catch((error) => {
                const failMsg = event.target.querySelector('.auth-form__fail_msg');
                failMsg.innerText = error.message;
                failMsg.classList.add('visible');
            });
    }
}

export default new SignupComponent();
