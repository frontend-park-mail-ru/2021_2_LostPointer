import { Component } from '../../framework/core/component.js';

class AppTopAlbums extends Component {
  constructor(props) {
    super(props);
    this.template = `
    <div class="listen-now__top-albums">
        {{# each albums}}
            <img class="top-album" src="/src/static/img/{{ img }}"/>
        {{/each}}
    </div>
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
