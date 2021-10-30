import { Component } from 'components/Component/component';
import { InputFormComponent } from 'components/InputForm/inputform';

import SignupFormTemplate from './signupform.hbs';

interface ISignupAuthFormProps {
    fail_msg: string;
    p_redirect_msg: string;
    a_redirect_msg: string;
    inputs: Array<string>;
}

export class SignupAuthForm extends Component<ISignupAuthFormProps> {
    private data: ISignupAuthFormProps;

    constructor() {
        super();
        this.data = {
            fail_msg: 'Registration failed',
            p_redirect_msg: 'Already registered?',
            a_redirect_msg: 'Sign in',
            inputs: [
                new InputFormComponent({
                    class: 'auth-form__input form__input',
                    name: 'nickname',
                    type: 'text',
                    placeholder: 'Nickname',
                }).render(),
                new InputFormComponent({
                    class: 'auth-form__input form__input',
                    name: 'email',
                    type: 'email',
                    placeholder: 'Email',
                }).render(),
                new InputFormComponent({
                    class: 'auth-form__input form__input',
                    name: 'password',
                    type: 'password',
                    placeholder: 'Password',
                }).render(),
                new InputFormComponent({
                    class: 'auth-form__input form__input',
                    name: 'confirm_password',
                    type: 'password',
                    placeholder: 'Confirm password',
                }).render(),
            ],
        };
    }

    render(): string {
        return SignupFormTemplate(this.data);
    }
}