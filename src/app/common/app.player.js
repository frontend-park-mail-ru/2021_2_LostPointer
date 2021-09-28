import { FWComponent } from '../../framework/index.js';

class AppPlayer extends FWComponent {
}

export const appPlayer = new AppPlayer({
  selector: 'player',
  template: `
  <img class="player-artwork" src="/src/static/img/albina.jpeg"/>
    <div class="now-playing">
        <div class="track-name">Megalovania</div>
        <div class="artist-name">Toby Fox</div>
    </div>
    <div class="player-controls">
    <img src="/src/static/img/skip.svg" class="player-skip-left">
    <img src="/src/static/img/play.svg" class="player-play">
    <img src="/src/static/img/skip.svg" class="player-skip-right">
    </div>
    <div class="player__time">0:00</div>
    <div class="player__seekbar"></div>
    <div class="player__time">03:30</div>
    <img class="shuffle" src="/src/static/img/shuffle.svg">
    <img class="repeat" src="/src/static/img/repeat.svg">
    <div class="player__seekbar player-volume"></div>
    <img class="player__volume-icon" src="/src/static/img/volume.svg">
  `,
});
