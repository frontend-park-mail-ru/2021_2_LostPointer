import { FWComponent } from '../../framework/index.js';

class AppSuggestedPlaylists extends FWComponent {
}

export const appSuggestedPlaylists = new AppSuggestedPlaylists({
  selector: 'suggested-playlists',
  template: `
  <div class="suggested-playlists__header">Your Playlists</div>
  <div class="suggested-playlists__container">
      {{# each playlists}}
          <div class="suggested-playlist">
              <img class="suggested-playlist-artwork" src="/src/static/img/{{ img }}">
              <div class="suggested-playlist-name">{{ name }}</div>
          </div>
      {{/each}}
  </div>
  `,
  data: {
    playlists: [
      {
        img: 'yur.jpg',
        name: 'Jail Mix',
      },
      {
        img: 'albina.jpeg',
        name: 'Resine Working Mix Extended',
      },
      {
        img: 'starboy.jpg',
        name: 'Workout Mix 2',
      },
    ],
  },
});
