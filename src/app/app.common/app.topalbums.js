import { Component } from '../../framework/core/component.js';

class AppTopAlbums extends Component {
  constructor(props) {
    super(props);
    this.selector = 'listen-now__top-albums';
    this.template = `
{{# each albums}}
  <img class="top-album" src="/src/static/img/{{ img }}"/>
{{/each}}
  `;
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
  }
}

export const appTopAlbums = new AppTopAlbums();
