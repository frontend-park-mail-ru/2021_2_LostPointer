import { Component } from 'components/Component/component';

import AlertTemplate from './alert.hbs';
import './alert.scss';

const alertTimeout = 1000;

interface IAlertProps {
    text: string;
}

export class Alert extends Component<IAlertProps> {
    constructor(props: IAlertProps) {
        super(props);
    }

    render() {
        return AlertTemplate(this.props);
    }

    static alert(text: string) {
        document.querySelector('.alerts').innerHTML = new Alert({
            text: text,
        }).render();
        const alert = document.querySelector('.alert-item');
        window.setTimeout(() => {
            alert.remove();
        }, alertTimeout);
    }
}
