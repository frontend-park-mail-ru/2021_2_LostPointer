import { Component } from '../../framework/core/component.js';

class PlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.player = new Audio();
    this.data = {
      cover: '/src/static/img/artworks/no_artwork.webp',
      playButton: document.querySelector('.player-play'),
    };
    this.player.addEventListener('loadedmetadata', () => {
      this.data.current_time = '0:00';
      this.data.total_time = `${(this.player.duration / 60) | 0}:${(this.player.duration % 60) | 0}`;
      this.data.playing = true;
      this.render();
    });
    this.player.loop = false;
    this.buttonsHandler = (e) => {
      if (e.target.classList.contains('repeat')) {
        this.player.loop = !e.target.classList.contains('enabled');
        // eslint-disable-next-line no-unused-expressions
        this.player.loop ? e.target.classList.add('enabled') : e.target.classList.remove('enabled');
      } else if (e.target.classList.contains('shuffle')) {
        this.player.shuffle = e.target.classList.contains('enabled');
      }
      console.log(this.player.loop);
    };
    this.playHandler = () => { document.querySelector('.player-play').src = '/src/static/img/pause.svg'; };
    this.pauseHandler = () => { document.querySelector('.player-play').src = '/src/static/img/play.svg'; };
    this.seekbarHandler = (e) => { this.seek(e.x); };
    this.playing = false;
    this.resizeListener = () => { this.seekbarPos = document.querySelector('.player__seekbar').getBoundingClientRect(); };
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

    const totalSeconds = (this.player.duration % 60) | 0;
    const zero = totalSeconds < 10 ? '0' : '';

    this.data = {
      cover: track.cover,
      track: track.title,
      artist: track.artist,
      current_time: '0:00',
      total_time: `${this.player.duration / 60}:${zero}${totalSeconds}`,
    };

    this.playing = true;
    this.player.play();
  }

  unmount() {
    console.error('remove');
    window.removeEventListener('resize', this.resizeListener);
  }

  toggle() {
    this.playing = !this.playing;
    // eslint-disable-next-line no-unused-expressions
    this.playing ? this.player.pause() : this.player.play();
  }

  setup() {
    const seekbar = document.querySelector('.player__seekbar');
    this.seekbarCurrent = document.querySelector('.seekbar-current');
    this.seekbarPos = seekbar.getBoundingClientRect();

    document.querySelector('.repeat').addEventListener('click', this.buttonsHandler);
    document.querySelector('.shuffle').addEventListener('click', this.buttonsHandler);
    window.addEventListener('resize', this.resizeListener);
    document.querySelector('.player__seekbar').addEventListener('click', this.seekbarHandler);

    document.querySelector('.player-play').addEventListener('click', () => {
      // eslint-disable-next-line no-unused-expressions
      this.playing ? this.player.pause() : this.player.play();
      this.playing = !this.playing;
    });
    const playerTime = document.querySelector('#player-time-current');
    this.player.addEventListener('timeupdate', () => {
      const seconds = (this.player.currentTime % 60) | 0;
      const zero = seconds < 10 ? '0' : '';
      this.seekbarCurrent.style.width = `${(this.player.currentTime / this.player.duration) * 100}%`;
      playerTime.innerHTML = `${(this.player.currentTime / 60) | 0}:${zero}${seconds}`;
    });
    this.player.addEventListener('pause', this.pauseHandler);
    this.player.addEventListener('play', this.playHandler);
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
