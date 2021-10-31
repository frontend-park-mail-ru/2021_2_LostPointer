import { Component } from 'components/Component/component';

import InputFormTemplate from './inputform.hbs';
import './inputform.scss'

export class InputFormComponent extends Component<null> {
    constructor(props) {
        super(props);
    }

    render() {
        return InputFormTemplate(this.props);
    }
}
