import { Component } from '../../framework/core/component.js';

class AppTopAlbums extends Component {
  constructor(props) {
    super(props);
    this.data = {
      albums: [
        {
          img: 'c80c6cdd-b976-471b-9eb2-72610e4d61b5.jpeg',
        },
        {
          img: 'd8d42756-b89f-41f2-8dc9-2c5d3405e20e.jpeg',
        },
        {
          img: 'bc17edcb-4dc4-46cf-9ae9-412cb6bd6955.jpeg',
        },
        {
          img: 'a5c1ab2f-00e0-4b7b-a780-852653f0eed9.jpeg',
        },
      ],
    };
    this.template = Handlebars.templates['topalbums.hbs'](this.data);
  }
}

export { AppTopAlbums };
