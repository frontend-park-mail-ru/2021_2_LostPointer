import { Component } from '../../framework/core/component.js';

class AppTopAlbums extends Component {
  constructor(props) {
    super(props);
    this.data = {
      albums: [
        {
          img: 'id.jpeg',
        },
        {
          img: 'albina.jpeg',
        },
        {
          img: 'starboy.jpg',
        },
        {
          img: 'yur.jpg',
        },
      ],
    };
    this.template = Handlebars.templates['topalbums.hbs'](this.data);
  }
}

export const appTopAlbums = new AppTopAlbums();
