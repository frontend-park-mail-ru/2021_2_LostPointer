import { FWComponent } from '../../framework/index.js';

class AppTopAlbums extends FWComponent {
}

export const appTopAlbums = new AppTopAlbums({
  selector: 'listen-now__top-albums',
  template: `
{{# each albums}}
  <img class="top-album" src="/src/static/img/{{ img }}"/>
{{/each}}
  `,
  data: {
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
  },
});
