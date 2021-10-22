import { Component } from 'components/component/component';
import { InputFormComponent } from 'components/inputform/inputform';

const SignupFormTemplate = require('./signupform.hbs');

interface ISignupAuthFormProps {
    fail_msg: string,
    p_redirect_msg: string,
    a_redirect_msg: string,
    inputs: Array<string>,
}

class SignupAuthForm extends Component<ISignupAuthFormProps> {
    constructor() {
        super();
        this.props = {
            fail_msg: 'Registration failed',
            p_redirect_msg: 'Already registered?',
            a_redirect_msg: 'Sign in',
            inputs: [
                new InputFormComponent({
                    name: 'nickname',
                    type: 'text',
                    placeholder: 'Nickname',
                }).render(),
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
                new InputFormComponent({
                    name: 'confirm_password',
                    type: 'password',
                    placeholder: 'Confirm password',
                }).render(),
            ],
        };
    }

    render(): string {
        return SignupFormTemplate(this.props);
    }
}

export { SignupAuthForm };
