import { FWComponent } from '../../framework/index.js';

class AppSuggestedArtists extends FWComponent {
}

export const appSuggestedArtists = new AppSuggestedArtists({
  selector: 'suggested-artists',
  template: `
  <div class="suggested-artists__header">Top Artists</div>
  <div class="suggested-artists__container">
      <img class="suggested-artist" src="/src/static/img/starboy.jpg">
      <img class="suggested-artist" src="/src/static/img/albina.jpeg">
      <img class="suggested-artist"  src="/src/static/img/yur.jpg">
      <img class="suggested-artist" src="/src/static/img/id.jpeg">
  </div>
  `,
});
