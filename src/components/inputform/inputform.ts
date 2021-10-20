import { Component } from '../../managers/component';

const InputFormTemplate = require('./inputform.hbs');

export class InputFormComponent extends Component {
    constructor(props) {
        super(props);
        this.template = InputFormTemplate;
    }

    render() {}
}
