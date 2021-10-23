import { Component } from 'components/component/component';
import { SignupAuthForm } from 'components/signupform/signupform';
import { addInputsEventListeners, CustomValidation, isValidForm } from 'services/validation/validation';
import { navigateTo } from 'services/router/router';
import {
    confirmPasswordValidityChecks,
    emailValidityChecks,
    nameValidityChecks,
    passwordValidityChecks,
} from 'services/validation/validityChecks';
import Request from 'services/request/request';
import {ICustomInput} from "interfaces/CustomInput";

import './signupcomponent.scss';

import SignupComponentTemplate from './signupcomponent.hbs';

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

        (<ICustomInput>nicknameInput).CustomValidation = new CustomValidation(nameValidityChecks, invalidities);
        (<ICustomInput>emailInput).CustomValidation = new CustomValidation(emailValidityChecks, invalidities);
        (<ICustomInput>passwordInput).CustomValidation = new CustomValidation(passwordValidityChecks, invalidities);
        (<ICustomInput>confirmPasswordInput).CustomValidation = new CustomValidation(
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
