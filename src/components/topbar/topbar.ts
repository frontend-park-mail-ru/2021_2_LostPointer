import { Component } from 'managers/component';

const TopbarTemplate = require('./topbar.hbs');

class TopBar extends Component {
    constructor(props) {
        super(props);
        this.data.avatar = 'ava.png';
        this.template = TopbarTemplate;
    }

    update() {
        this.template = TopbarTemplate(this.data);
        document.querySelector('.topbar').outerHTML = this.getHtml();
    }
}

export { TopBar };
