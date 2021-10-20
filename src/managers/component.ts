import Handlebars = require("handlebars");

export class Component {

    protected isLoaded: boolean;
    protected template: any;
    protected data: any;

    constructor(props) {
        this.isLoaded = false;
        if (props) {
            this.data = { ...props };
        }
    }

    getHtml() : string {
        if (this.data === undefined) {
            return this.template;
        }
        const template = Handlebars.compile(this.template);
        return template(this.data);
    }

    render() : void {
        document.querySelector('.app').innerHTML = this.getHtml();
    }

    unmount() {}
}
