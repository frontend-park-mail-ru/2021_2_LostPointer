import { Component } from '../../framework/core/component.js';
// import Request from '../../framework/appApi/request.js';

class AppSuggestedArtists extends Component {
  constructor(props) {
    super(props);
    this.data = {
      artists: [
        { img: 'bcb4f887-6aaa-4205-be87-25bdc14e1aa0.jpeg' },
        { img: 'c80c6cdd-b976-471b-9eb2-72610e4d61b5.jpeg' },
        { img: 'e4596b4e-b908-4b33-a788-d68477bc996c.jpeg' },
        { img: 'd2e4296c-728f-4e02-85b7-79769edfd999.jpeg' },
      ],
    };
    // eslint-no-undef
    this.template = Handlebars.templates['suggestedartists.hbs'](this.data);
  }
}

export { AppSuggestedArtists };
