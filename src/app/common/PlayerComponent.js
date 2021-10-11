import { Component } from '../../framework/core/component.js';

class PlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.player = new Audio();
    this.data = {};
    this.player.addEventListener('loadedmetadata', () => {
      this.data.current_time = '0:00';
      this.data.total_time = `${(this.player.duration / 60) | 0}:${(this.player.duration % 60) | 0}`;
      this.render();
    });
    this.playing = false;
  }

  seek(xPos) {
    const seek = (xPos - this.seekbarPos.left) / this.seekbarPos.width;
    this.seekbarCurrent.style.width = `${seek * 100}%`;
    this.player.currentTime = this.player.duration * seek;
  }

  setTrack(track) {
    this.playing = false;
    this.player.pause();
    this.player.src = track.url;
    this.data.cover = track.cover;
    this.data.track = track.title;
    this.data.artist = track.artist;
    this.data.current_time = '0:00';
    const totalSeconds = (this.player.duration % 60) | 0;
    const zero = totalSeconds < 10 ? '0' : '';
    this.data.total_time = `${this.player.duration / 60}:${zero}${totalSeconds}`;
  }

  setup() {
    const seekbar = document.querySelector('.player__seekbar');
    this.seekbarCurrent = document.querySelector('.seekbar-current');
    this.seekbarPos = seekbar.getBoundingClientRect();
    window.addEventListener('resize', () => {
      this.seekbarPos = seekbar.getBoundingClientRect();
    });
    document.querySelector('.player__seekbar').addEventListener('click', (e) => {
      this.seek(e.x);
    });
    const playButton = document.querySelector('.player-play');
    document.querySelector('.player-play').addEventListener('click', () => {
      // eslint-disable-next-line no-unused-expressions
      this.playing ? this.player.pause() : this.player.play();
      this.playing = !this.playing;
      playButton.src = this.playing ? '/src/static/img/pause.svg' : '/src/static/img/play.svg';
    });
    const playerTime = document.querySelector('#player-time-current');
    this.player.addEventListener('timeupdate', () => {
      const seconds = (this.player.currentTime % 60) | 0;
      const zero = seconds < 10 ? '0' : '';
      this.seekbarCurrent.style.width = `${(this.player.currentTime / this.player.duration) * 100}%`;
      playerTime.innerHTML = `${(this.player.currentTime / 60) | 0}:${zero}${seconds}`;
    });
  }

  render() {
    this.template = Handlebars.templates['player.hbs'](this.data);
    const player = document.querySelector('.player');
    const app = document.querySelector('.app');
    if (player) {
      player.remove();
      app.insertAdjacentHTML('beforeend', this.getHtml());
      this.setup();
    }
  }
}

export { PlayerComponent };
