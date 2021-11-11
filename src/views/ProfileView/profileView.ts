import { View } from 'views/View/view';
import { Topbar } from 'components/Topbar/topbar';
import { PlayerComponent } from 'components/Player/player';
import { Sidebar } from 'components/Sidebar/sidebar';
import { ICustomInput } from 'interfaces/CustomInput';
import { CustomValidation, isValidForm } from 'services/validation/validation';
import {
    confirmPasswordValidityChecks,
    emailValidityChecks,
    nameValidityChecks,
    passwordValidityChecks,
    simplePasswordValidityChecks,
} from 'services/validation/validityChecks';
import { ProfileForm } from 'components/ProfileForm/profileForm';
import { UserModel } from 'models/user';

import ProfileTemplate from './profileView.hbs';
import './profileView.scss';
import disableBrokenImg from 'views/utils';
import store from 'services/store/store';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';

interface IProfileViewProps {
    authenticated: boolean;
}

export class ProfileView extends View<IProfileViewProps> {
    private authenticated: boolean;
    private authHandler: (e) => void;

    private player: PlayerComponent;
    private sidebar: Sidebar;
    private topbar: Topbar;
    private profileform: ProfileForm;
    private userAvatar: string;
    private user: UserModel;

    constructor(props?: IProfileViewProps) {
        super(props);
        this.isLoaded = false;
    }

    didMount() {
        if (!store.get('authenticated')) {
            router.go(routerStore.signin);
            return;
        }
        this.userAvatar = store.get('userAvatar');

        UserModel.getSettings().then((user) => {
            this.user = user;
            this.sidebar = new Sidebar();
            this.topbar = new Topbar({
                authenticated: this.authenticated,
                avatar: user.getProps().small_avatar,
                offline: !navigator.onLine,
            });
            this.player = new PlayerComponent();
            this.profileform = new ProfileForm(user.getProps());
            this.isLoaded = true;
            this.render();
        });
    }

    uploadAvatarFile(event) {
        event.preventDefault();

        const file = event.target.files[0];
        let readFile = null;
        const msg = document.querySelector('.profile-avatar__msg');
        (<HTMLElement>msg).innerText = '';

        const formdata = new FormData();
        formdata.append('avatar', file, file.name);

        const ext = file.name
            .substring(file.name.lastIndexOf('.') + 1)
            .toLowerCase();
        if (
            ext === 'gif' ||
            ext === 'png' ||
            ext === 'jpeg' ||
            ext === 'jpg' ||
            ext === 'webp'
        ) {
            const reader = new FileReader();
            reader.addEventListener('load', (e) => {
                e.preventDefault();
                const avatar = document.querySelector('.profile-avatar__img');
                if (typeof e.target.result === 'string') {
                    avatar.setAttribute('src', e.target.result);
                    (<HTMLElement>avatar).style.display = 'block';
                    readFile = e.target.result;
                }
            });
            reader.readAsDataURL(file);
        } else {
            msg.classList.remove('success');
            (<HTMLElement>msg).innerText = 'Invalid file';
            msg.classList.add('fail', 'visible');
            return;
        }

        this.user
            .updateSettings(formdata)
            .then((body) => {
                if (body.status === 200) {
                    const smallAvatar = document.querySelector(
                        '.topbar-profile__img'
                    );
                    smallAvatar.setAttribute('src', readFile);
                    (<HTMLElement>smallAvatar).style.display = 'block';
                    msg.classList.remove('fail');
                    (<HTMLElement>msg).innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');
                } else {
                    msg.classList.remove('success');
                    (<HTMLElement>msg).innerText = body.message;
                    msg.classList.add('fail', 'visible');
                }
            })
            .catch(() => {
                msg.classList.remove('success');
                (<HTMLElement>msg).innerText = 'Avatar changing failed';
                msg.classList.add('fail', 'visible');
            });
    }

    submitChangeProfileForm(event) {
        event.preventDefault();

        const nicknameInput = event.target.querySelector(
            'input[name="nickname"]'
        );
        const emailInput = event.target.querySelector('input[name="email"]');
        const oldPasswordInput = event.target.querySelector(
            'input[name="old_password"]'
        );
        const passwordInput = event.target.querySelector(
            'input[name="password"]'
        );
        const confirmPasswordInput = event.target.querySelector(
            'input[name="confirm_password"]'
        );
        const invalidities = document.querySelector(
            '.profile-form__invalidities'
        );
        const msg = event.target.querySelector('.profile-form__msg');
        invalidities.innerHTML = '';
        msg.innerHTML = '';

        let requiredInputsNumber = 2;
        if (
            oldPasswordInput.value !== '' ||
            passwordInput.value !== '' ||
            confirmPasswordInput.value !== ''
        ) {
            (<ICustomInput>oldPasswordInput).CustomValidation =
                new CustomValidation(
                    simplePasswordValidityChecks,
                    invalidities
                );
            (<ICustomInput>passwordInput).CustomValidation =
                new CustomValidation(passwordValidityChecks, invalidities);
            (<ICustomInput>confirmPasswordInput).CustomValidation =
                new CustomValidation(
                    confirmPasswordValidityChecks,
                    invalidities
                );
            requiredInputsNumber = 5;
        } else {
            delete oldPasswordInput.CustomValidation;
            delete passwordInput.CustomValidation;
            delete confirmPasswordInput.CustomValidation;
            const userSettings = this.user.getProps();
            if (
                userSettings.nickname == nicknameInput.value &&
                userSettings.email == emailInput.value
            ) {
                return;
            }
        }

        if (!isValidForm(requiredInputsNumber)) {
            msg.classList.add('fail', 'visible');
            return;
        }

        const formdata = new FormData();
        formdata.append('nickname', nicknameInput.value);
        formdata.append('email', emailInput.value);

        if (oldPasswordInput.value && passwordInput.value) {
            formdata.append('old_password', oldPasswordInput.value);
            formdata.append('new_password', passwordInput.value);
        }

        this.user
            .updateSettings(formdata)
            .then((body) => {
                if (body.status === 200) {
                    msg.classList.remove('fail');
                    msg.innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');
                } else {
                    msg.classList.remove('success');
                    msg.innerText = body.message;
                    msg.classList.add('fail', 'visible');
                }
            })
            .catch(() => {
                msg.classList.remove('success');
                msg.innerText = 'Profile changing failed';
                msg.classList.add('fail', 'visible');
            });
    }

    addListeners() {
        document.addEventListener('click', this.authHandler);

        const form = document.querySelector('.profile-form');
        const nicknameInput = form.querySelector('input[name="nickname"]');
        const emailInput = form.querySelector('input[name="email"]');
        const invalidities = document.querySelector(
            '.profile-form__invalidities'
        );

        (<ICustomInput>nicknameInput).CustomValidation = new CustomValidation(
            nameValidityChecks,
            invalidities
        );
        (<ICustomInput>emailInput).CustomValidation = new CustomValidation(
            emailValidityChecks,
            invalidities
        );

        form.addEventListener(
            'submit',
            this.submitChangeProfileForm.bind(this)
        );
        const fileInput = document.querySelector('input[name="file"]');
        fileInput.addEventListener('change', this.uploadAvatarFile.bind(this));

        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', disableBrokenImg);
        });
    }

    unmount() {
        document.querySelectorAll('img').forEach(function (img) {
            img.removeEventListener('error', disableBrokenImg);
        });
        this.isLoaded = false;
    }

    render() {
        if (!navigator.onLine) {
            router.go(routerStore.dashboard);
            return;
        }
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.querySelector('.main-layout__content').innerHTML =
            ProfileTemplate({
                profileform: this.profileform.render(),
            });
        this.addListeners();
    }
}

export default new ProfileView();
