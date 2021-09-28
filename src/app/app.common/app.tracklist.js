import { FWComponent } from '../../framework/index.js';

class AppTrackList extends FWComponent {
}

export const appTrackList = new AppTrackList({
  selector: 'track-list',
  template: `
  <div class="suggested-tracks__header">Tracks of the Week</div>
  <div class="suggested-tracks-container">
      {{# each tracks}}
          <div class="track-list-item">
              <img class="track-list-item__artwork" src="/src/static/img/{{ img }}">
              <div class="track-list-item__name-container">
                  <div class="track-list-item__name">{{ name }}</div>
                  <div class="track-list-item__artist">{{ artist }}</div>
              </div>
              <div class="track-list-item__ellipsis">
                  <img class="track-list-item-fav" src="/src/static/img/favorite.svg">
                  <img class="track-list-item-play" src="/src/static/img/play-outline.svg">
              </div>
          </div>
      {{/each}}
  </div>
  `,
  data: {
    tracks: [
      {
        img: 'saptded.webp',
        name: 'Песня про кабанчик и стаканчик и прочие приколы',
        artist: 'Saptded',
      },
      {
        img: 'saptded.webp',
        name: 'Песня про кабанчик и стаканчик и прочие приколы',
        artist: 'Saptded',
      },
      {
        img: 'saptded.webp',
        name: 'Песня про кабанчик и стаканчик и прочие приколы',
        artist: 'Saptded',
      },
      {
        img: 'saptded.webp',
        name: 'Песня про кабанчик и стаканчик и прочие приколы',
        artist: 'Saptded',
      },
      {
        img: 'saptded.webp',
        name: 'Песня про кабанчик и стаканчик и прочие приколы',
        artist: 'Saptded',
      },
    ],
  },
});
