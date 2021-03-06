import { View } from 'views/View/view';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import player from 'components/Player/player';
import { ICustomInput } from 'interfaces/CustomInput';
import { CustomValidation, isValidForm } from 'services/validation/validation';
import {
    confirmPasswordValidityChecks,
    emailValidityChecks,
    nameValidityChecks,
    passwordValidityChecks,
    simplePasswordValidityChecks,
} from 'services/validation/validityChecks';
import { ProfileForm } from 'lostpointer-uikit';
import { UserModel } from 'models/user';
import {
    addDisableBrokenImgListeners,
    removeDisableBrokenImgListeners,
    scrollUp,
} from 'views/utils';
import store from 'services/store/store';
import baseView from 'views/BaseView/baseView';

import ProfileTemplate from './profileView.hbs';
import './profileView.scss';

export class ProfileView extends View<never> {
    private profileform: ProfileForm;
    private user: UserModel;

    uploadAvatarFile(event) {
        event.preventDefault();

        const file = event.target.files[0];
        let readFile = null;
        const msg = document.querySelector('.profile-avatar__msg');
        (<HTMLElement>msg).innerText = '';

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
            .updateSettings(null, null, null, null, file)
            .then((body) => {
                if (body.status === 200) {
                    const smallAvatar = document.querySelector('.avatar__img');
                    smallAvatar.setAttribute('src', readFile);
                    (<HTMLElement>smallAvatar).style.display = 'block';
                    msg.classList.remove('fail');
                    (<HTMLElement>msg).innerText = 'Changed successfully';
                    msg.classList.add('success', 'visible');
                    UserModel.auth().then((authData) => {
                        store.set('userAvatar', authData.avatar);
                        store.set('authenticated', authData.authenticated);
                    });
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
        const passwordInvalidities = document.querySelector(
            '.password__invalidities'
        );
        const msg = event.target.querySelector('.profile-form__msg');
        passwordInvalidities.innerHTML = '';
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
                    passwordInvalidities
                );
            (<ICustomInput>passwordInput).CustomValidation =
                new CustomValidation(
                    passwordValidityChecks,
                    passwordInvalidities
                );
            (<ICustomInput>confirmPasswordInput).CustomValidation =
                new CustomValidation(
                    confirmPasswordValidityChecks,
                    passwordInvalidities
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

        this.user
            .updateSettings(
                nicknameInput.value,
                emailInput.value,
                oldPasswordInput.value && passwordInput.value
                    ? oldPasswordInput.value
                    : null,
                oldPasswordInput.value && passwordInput.value
                    ? passwordInput.value
                    : null
            )
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

    logoutHandler(event) {
        event.stopPropagation();
        UserModel.logout().then(() => {
            player.stop();
            player.clear();
            store.set('authenticated', false);
            window.localStorage.removeItem('lastPlayedData');
            router.go(routerStore.dashboard);
        });
    }

    addListeners() {
        const form = document.querySelector('.profile-form');
        const nicknameInput = form.querySelector('input[name="nickname"]');
        const emailInput = form.querySelector('input[name="email"]');
        const invalidities = document.querySelector('.profile__invalidities');

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

        addDisableBrokenImgListeners();

        document.querySelectorAll('.js-logout').forEach((el) => {
            el.addEventListener('click', this.logoutHandler.bind(this));
        });
    }

    unmount() {
        removeDisableBrokenImgListeners();
        document.querySelectorAll('.js-logout').forEach((el) => {
            el.removeEventListener('click', this.logoutHandler.bind(this));
        });

        const form = document.querySelector('.profile-form');
        if (form) {
            form.removeEventListener(
                'submit',
                this.submitChangeProfileForm.bind(this)
            );
        }
        const fileInput = document.querySelector('input[name="file"]');
        if (fileInput) {
            fileInput.removeEventListener(
                'change',
                this.uploadAvatarFile.bind(this)
            );
        }
    }

    render() {
        if (!store.get('authenticated')) {
            router.go(routerStore.signin);
            return;
        }

        UserModel.getSettings().then((user) => {
            this.user = user;
            this.profileform = new ProfileForm(user.getProps());

            baseView.render();

            document.querySelector('.main-layout__content').innerHTML =
                ProfileTemplate({
                    profileform: this.profileform.render(),
                });
            this.addListeners();
            scrollUp();
        });
    }
}

export default new ProfileView();
