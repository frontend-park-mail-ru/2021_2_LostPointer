import {View} from 'views/View/view';
import Request from 'services/request/request';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import {Topbar} from 'components/Topbar/topbar';
import {PlayerComponent} from 'components/Player/player';
import {Sidebar} from 'components/Sidebar/sidebar';
import {ICustomInput} from 'interfaces/CustomInput';
import {CustomValidation, isValidForm} from 'services/validation/validation';
import {
    confirmPasswordValidityChecks,
    emailValidityChecks,
    nameValidityChecks,
    passwordValidityChecks,
    simplePasswordValidityChecks,
} from 'services/validation/validityChecks';
import {ProfileForm} from 'components/ProfileForm/profileForm';
import {UserModel} from 'models/user';

import ProfileTemplate from './profileView.hbs';
import './profileView.scss';

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
        this.addHandlers();
    }

    didMount() {
        UserModel.auth()
            .then((authResponse) => {
            this.authenticated = authResponse.authenticated;
            if (!this.authenticated) {
                router.go(routerStore.signin);
                return;
            }
            this.userAvatar = authResponse.avatar;

            UserModel.getSettings()
                .then((user) => {
                    this.user = user;
                    this.sidebar = new Sidebar();
                    this.topbar = new Topbar({
                        authenticated: this.authenticated,
                        avatar: user.getProps().small_avatar,
                    })
                    this.player = new PlayerComponent();
                    this.profileform = new ProfileForm(user.getProps());
                    this.isLoaded = true;
                    this.render();
                })
        });
    }

    uploadAvatarFile(event) {
        const file = event.target.files[0];
        const msg = document.querySelector('.profile-avatar__msg');

        const formdata = new FormData();
        formdata.append('avatar', file, file.name);

        const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (ext === 'gif' || ext === 'png' || ext === 'jpeg' || ext === 'jpg' || ext === 'webp') {
            const reader = new FileReader();
            reader.addEventListener('load', (e) => {
                const avatar = document.querySelector('.profile-avatar__img');
                if (typeof e.target.result === 'string') {
                    avatar.setAttribute('src', e.target.result);
                }
            });
            reader.readAsDataURL(file);
        } else {
            msg.classList.remove('success');
            (<HTMLElement>msg).innerText = 'Invalid file';
            msg.classList.add('fail', 'visible');
            return;
        }

        this.user.updateSettings(formdata)
            .then((body) => {
                if (body.status === 200) {
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

        const nicknameInput = event.target.querySelector('input[name="nickname"]');
        const emailInput = event.target.querySelector('input[name="email"]');
        const oldPasswordInput = event.target.querySelector('input[name="old_password"]');
        const passwordInput = event.target.querySelector('input[name="password"]');
        const confirmPasswordInput = event.target.querySelector('input[name="confirm_password"]');
        const invalidities = document.querySelector('.profile-form__invalidities');
        const msg = event.target.querySelector('.profile-form__msg');
        invalidities.innerHTML = '';
        msg.innerHTML = '';

        let requiredInputsNumber = 2;
        if (oldPasswordInput.value !== ''
            || passwordInput.value !== ''
            || confirmPasswordInput.value !== '') {
            (<ICustomInput>oldPasswordInput).CustomValidation = new CustomValidation(
                simplePasswordValidityChecks,
                invalidities,
            );
            (<ICustomInput>passwordInput).CustomValidation = new CustomValidation(
                passwordValidityChecks,
                invalidities,
            );
            (<ICustomInput>confirmPasswordInput).CustomValidation = new CustomValidation(
                confirmPasswordValidityChecks,
                invalidities,
            );
            requiredInputsNumber = 5;
        } else {
            delete oldPasswordInput.CustomValidation;
            delete passwordInput.CustomValidation;
            delete confirmPasswordInput.CustomValidation;
            const userSettings = this.user.getProps();
            if (userSettings.nickname == nicknameInput.value
                && userSettings.email == emailInput.value) {
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

        this.user.updateSettings(formdata)
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
        const invalidities = document.querySelector('.profile-form__invalidities');

        (<ICustomInput>nicknameInput).CustomValidation = new CustomValidation(
            nameValidityChecks,
            invalidities,
        );
        (<ICustomInput>emailInput).CustomValidation = new CustomValidation(
            emailValidityChecks,
            invalidities);

        form.addEventListener('submit', this.submitChangeProfileForm.bind(this));
        const fileInput = document.querySelector('input[name="file"]');
        fileInput.addEventListener('change', this.uploadAvatarFile.bind(this));
    }

    unmount() {
        this.isLoaded = false;
        this.player.unmount();
    }

    addHandlers() {
        this.authHandler = (e) => {
            if (
                e.target.className === 'topbar-auth' &&
                e.target.dataset.action === 'logout'
            ) {
                Request.post('/user/logout').then(() => {
                    this.player.stop();
                    this.authenticated = false;
                    this.props.authenticated = false;
                    this.player.clear();
                    window.localStorage.removeItem('lastPlayedData');
                    this.topbar.logout();
                });
            }
        };
    }

    render() {
        if (!this.isLoaded) {
            this.didMount();
            return;
        }

        document.getElementById('app').innerHTML = ProfileTemplate({
            topbar: this.topbar
                .set({
                    authenticated: this.authenticated,
                    avatar: this.userAvatar,
                })
                .render(),
            sidebar: this.sidebar.render(),
            profileform: this.profileform.render(),
            player: this.player.render(),
        });
        this.addListeners();
    }
}

export default new ProfileView();
