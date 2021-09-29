import { Component } from '../../framework/core/component.js';

class AppPlayer extends Component {
  constructor(props) {
    super(props);
    this.selector = 'player';
    this.template = `
  <img class="player-artwork" src="/src/static/img/{{ img }}"/>
    <div class="now-playing">
        <div class="track-name">{{ track_name }}</div>
        <div class="artist-name">{{ artist_name }}</div>
    </div>
    <div class="player-controls">
    <img src="/src/static/img/skip.svg" class="player-skip-left">
    <img src="/src/static/img/play.svg" class="player-play">
    <img src="/src/static/img/skip.svg" class="player-skip-right">
    </div>
    <div class="player__time"> {{ current_time }} </div>
    <div class="player__seekbar"></div>
    <div class="player__time"> {{ total_time }} </div>
    <img class="shuffle" src="/src/static/img/shuffle.svg">
    <img class="repeat" src="/src/static/img/repeat.svg">
    <div class="player__seekbar player-volume"></div>
    <img class="player__volume-icon" src="/src/static/img/volume.svg">
  `;
    this.data = {
      img: 'albina.jpeg',
      track_name: 'Megalovania',
      artist_name: 'Toby Fox',
      current_time: '00:00',
      total_time: '03:30',
    };
  }
}

export const appPlayer = new AppPlayer();
