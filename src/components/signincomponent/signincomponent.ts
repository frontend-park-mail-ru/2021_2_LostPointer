import { Component } from 'components/component/component';
import { SigninAuthForm } from 'components/signinform/signinform';
import Request from '../../services/request/request';
import { addInputsEventListeners, CustomValidation, isValidForm } from '../../../src/services/validation/validation';
import { emailValidityChecks, simplePasswordValidityChecks } from '../../../src/services/validation/validityChecks';
import {routerStore, navigateTo} from '../../../src/services/router/router';

const SigninComponentTemplate = require('./signincomponent.hbs');

import './signincomponent.scss';

interface ISigninComponentProps {
    placeholder_img: string,
    title: string,
    description: string,
    form: string
}

export class SigninComponent extends Component<ISigninComponentProps> {
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
        document.querySelector('.app').innerHTML = SigninComponentTemplate(this.props);
        const form = document.querySelector('.auth-form');
        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const invalidities = document.querySelector('.auth-form__invalidities');

        // @ts-ignore //TODO=Починить
        emailInput.CustomValidation = new CustomValidation(emailValidityChecks, invalidities);
        // @ts-ignore //TODO=Починить
        passwordInput.CustomValidation = new CustomValidation(
            simplePasswordValidityChecks, invalidities,
        );

        addInputsEventListeners(form);
        form.addEventListener('submit', this.submitSigninForm);
    }

    submitSigninForm(event) {
        event.preventDefault();
        const errorsField = document.querySelector('.auth-form__fail_msg');
        errorsField.innerHTML = '&nbsp;';

        if (!isValidForm(2)) {
            errorsField.classList.add('visible');
            return;
        }
        const emailInput = event.target.querySelector('input[name="email"]');
        const passwordInput = event.target.querySelector('input[name="password"]');

        Request.post(
            '/user/signin',
            JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value.trim(),
            }),
            undefined
        )
            .then(({status, body}) => {
                if (status === 200) {
                    navigateTo(routerStore.dashboard);
                } else {
                    const failMsg = event.target.querySelector('.auth-form__fail_msg');
                    failMsg.innerText = body.message;
                    failMsg.classList.add('visible');
                }
            })
            .catch((error) => {
                const failMsg = event.target.querySelector('.auth-form__fail_msg');
                failMsg.innerText = 'Authentication failed';
                failMsg.classList.add('visible');
            });
    }
}

export default new SigninComponent();
