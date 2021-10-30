import { Component } from 'components/Component/component';
import { InputFormComponent } from 'components/InputForm/inputform';

import SigninFormTemplate from './signinform.hbs';
import './signinform.scss';

interface ISigninAuthFormProps {
    fail_msg: string;
    p_redirect_msg: string;
    a_redirect_msg: string;
    inputs: Array<string>;
}

export class SigninAuthForm extends Component<ISigninAuthFormProps> {
    private data: ISigninAuthFormProps;

    constructor() {
        super();
        this.data = {
            fail_msg: 'Authentication failed',
            p_redirect_msg: "Don't have an account?",
            a_redirect_msg: 'Sign up',
            inputs: [
                new InputFormComponent({
                    name: 'email',
                    type: 'email',
                    placeholder: 'Email',
                }).render(),
                new InputFormComponent({
                    name: 'password',
                    type: 'password',
                    placeholder: 'Password',
                }).render(),
            ],
        };
    }

    render(): string {
        return SigninFormTemplate(this.data);
    }
}
