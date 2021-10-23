import { Component } from 'components/component/component';

import InputFormTemplate from './inputform.hbs';

export class InputFormComponent extends Component<null> {
    constructor(props) {
        super(props);
    }

    render() {
        return InputFormTemplate(this.props);
    }
}
