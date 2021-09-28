import { FWComponent } from '../../framework/index.js';

class AppSuggestedPlaylists extends FWComponent {
}

export const appSuggestedPlaylists = new AppSuggestedPlaylists({
  selector: 'suggested-playlists',
  template: `
  <div class="suggested-playlists__header">Your Playlists</div>
  <div class="suggested-playlists__container">
      <div class="suggested-playlist">
          <img class="suggested-playlist-artwork" src="/src/static/img/yur.jpg">
          <div class="suggested-playlist-name">Jail Mix</div>
      </div>
      <div class="suggested-playlist">
          <img class="suggested-playlist-artwork" src="/src/static/img/albina.jpeg">
          <div class="suggested-playlist-name">Resine Working Mix Extended</div>
      </div>
      <div class="suggested-playlist">
          <img class="suggested-playlist-artwork" src="/src/static/img/starboy.jpg">
          <div class="suggested-playlist-name">Workout Mix 2</div>
      </div>
  </div>
  `,
});
