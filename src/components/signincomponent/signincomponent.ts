import { Component } from '../../managers/component';
import { SigninAuthForm } from '../signinform/signinform';
import Request from '../../framework/appApi/request';
import { addInputsEventListeners, CustomValidation, isValidForm } from '../../framework/validation/validation';
import { emailValidityChecks, simplePasswordValidityChecks } from '../../framework/validation/validityChecks';
// eslint-disable-next-line import/no-cycle
import { navigateTo } from '../../framework/core/router';

const SigninComponentTemplate = require('./signincomponent.hbs');

export class SigninComponent extends Component {

    protected data: {
        placeholder_img: string,
        title: string,
        description: string,
        form: SigninAuthForm
    }

    constructor(config) {
        super(config);
        // TODO рендерить signin_form
        this.data = {
            placeholder_img: 'woman_headphones_2.webp',
            title: 'Sign in',
            description: 'Let’s get all required data and sign in',
            form: new SigninAuthForm(null),
        };
        this.template = SigninComponentTemplate;
    }

    render() {
        super.render();

        const form = document.querySelector('.auth-form');
        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const invalidities = document.querySelector('.auth-form__invalidities');

        // @ts-ignore
        emailInput.CustomValidation = new CustomValidation(emailValidityChecks, invalidities);
        // @ts-ignore
        passwordInput.CustomValidation = new CustomValidation(simplePasswordValidityChecks, invalidities);

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
            .then(({ status, body }) => {
                if (status === 200) {
                    navigateTo('/');
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
                console.log(error.msg);
            });
    }
}
