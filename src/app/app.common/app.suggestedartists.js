import { FWComponent } from '../../framework/index.js';

class AppSuggestedArtists extends FWComponent {
}

export const appSuggestedArtists = new AppSuggestedArtists({
  selector: 'suggested-artists',
  template: `
  <div class="suggested-artists__header">Top Artists</div>
  <div class="suggested-artists__container">
  {{# each artists}}
      <img class="suggested-artist" src="{{ img }}">
  {{/each}}
  </div>
  `,
  data: {
    artists: [
      {
        img: '/src/static/img/starboy.jpg',
      },
      {
        img: '/src/static/img/albina.jpeg',
      },
      {
        img: '/src/static/img/yur.jpg',
      },
      {
        img: '/src/static/img/id.jpeg',
      },
    ],
  },
});
