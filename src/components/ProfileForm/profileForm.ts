import { Component } from 'components/Component/component';
import { ProfileInputForm } from 'components/ProfileInputForm/profileInputForm';
import { InputFormComponent } from 'components/InputForm/inputform';

import ProfileFormTemplate from './profileForm.hbs';
import './profileForm.scss';

interface IProfileFormProps {
    title: string;
    avatar: string;
    inputs: Array<string>;
    password_inputs: Array<string>;
}

export class ProfileForm extends Component<IProfileFormProps> {
    private readonly data: IProfileFormProps;

    constructor(props) {
        super(props);
        this.data = {
            title: 'Profile settings',
            avatar: props.big_avatar,
            inputs: [
                new ProfileInputForm({
                    label: 'Nickname',
                    input: new InputFormComponent({
                        class: 'profile-form__input form__input',
                        name: 'nickname',
                        type: 'text',
                        placeholder: 'Nickname',
                        value: props.nickname,
                    }).render(),
                }).render(),
                new ProfileInputForm({
                    label: 'Email',
                    input: new InputFormComponent({
                        class: 'profile-form__input form__input',
                        name: 'email',
                        type: 'email',
                        placeholder: 'Email',
                        value: props.email,
                    }).render(),
                }).render(),
            ],
            password_inputs: [
                new ProfileInputForm({
                    label: 'Old password',
                    input: new InputFormComponent({
                        class: 'profile-form__input form__input',
                        name: 'old_password',
                        type: 'password',
                    }).render(),
                }).render(),
                new ProfileInputForm({
                    label: 'New password',
                    input: new InputFormComponent({
                        class: 'profile-form__input form__input',
                        name: 'password',
                        type: 'password',
                    }).render(),
                }).render(),
                new ProfileInputForm({
                    label: 'Confirm password',
                    input: new InputFormComponent({
                        class: 'profile-form__input form__input',
                        name: 'confirm_password',
                        type: 'password',
                    }).render(),
                }).render(),
            ],
        };
    }

    render(): string {
        return ProfileFormTemplate(this.data);
    }
}
