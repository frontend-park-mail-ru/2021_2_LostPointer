import { Component } from '../../framework/core/component.js';

class PlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.player = new Audio();
    if (!this.getLastPlayed()) {
      this.data = {
        cover: '/src/static/img/artworks/no_artwork.webp',
        playButton: document.querySelector('.player-play'),
      };
    }
    this.firstTime = true;
    this.player.addEventListener('loadedmetadata', () => {
      this.data.current_time = '0:00';
      this.data.total_time = `${(this.player.duration / 60) | 0}:${(this.player.duration % 60) | 0}`;
      this.data.playing = !this.firstTime;
      this.firstTime = false;
      this.render();
    });
    this.player.loop = false;
    this.renderedOnce = false;
    this.buttonsHandler = (e) => {
      if (e.target.classList.contains('repeat')) {
        this.player.loop = !e.target.classList.contains('enabled');
        this.player.loop ? e.target.classList.add('enabled') : e.target.classList.remove('enabled');
        window.localStorage.setItem('playerLooped', `${this.player.loop}`);
      } else if (e.target.classList.contains('shuffle')) {
        this.player.shuffle = e.target.classList.contains('enabled'); // TODO
      } else if (e.target.classList.contains('mute')) {
        this.player.muted = !this.player.muted;
        this.player.muted ? e.target.classList.add('enabled') : e.target.classList.remove('enabled');
        window.localStorage.setItem('playerMuted', `${this.player.muted}`);
        e.target.src = `/src/static/img/${this.player.muted ? 'muted.svg' : 'volume.svg'}`;
      }
    };
    this.playHandler = () => { document.querySelector('.player-play').src = '/src/static/img/pause.svg'; };
    this.pauseHandler = () => { document.querySelector('.player-play').src = '/src/static/img/play.svg'; };
    this.seekbarHandler = (e) => this.seek(e.x);
    this.volumeHandler = (e) => this.volume(e.x);
    this.playButtonHandler = () => {
      this.data.playing ? this.player.pause() : this.player.play();
      this.data.playing = !this.data.playing;
    };
    this.timeUpdateHandler = () => {
      const seconds = (this.player.currentTime % 60) | 0;
      const zero = seconds < 10 ? '0' : '';
      this.seekbarCurrent.style.width = `${(this.player.currentTime / this.player.duration) * 100}%`;
      document.querySelector('#player-time-current').innerHTML = `${(this.player.currentTime / 60) | 0}:${zero}${seconds}`;
    };
    this.data.playing = false;
    this.resizeListener = () => {
      this.seekbarPos = document.querySelector('.player__seekbar').getBoundingClientRect();
      this.volumePos = document.querySelector('.player-volume').getBoundingClientRect();
    };
    this.switchTrackHandler = (e) => {
      let current;
      let allowed = false;
      if (e.action === 'nexttrack') {
        if (this.pos < this.playlist.length - 1) {
          this.playlist[this.pos].querySelector('.track-list-item-play').src = '/src/static/img/play-outline.svg';
          current = this.playlist[++this.pos].querySelector('.track-list-item-play');
          allowed = true;
        }
      } else if (this.pos >= 1) {
        this.playlist[this.pos].querySelector('.track-list-item-play').src = '/src/static/img/play-outline.svg';
        current = this.playlist[--this.pos].querySelector('.track-list-item-play');
        allowed = true;
      }
      if (allowed) {
        current.src = '/src/static/img/pause-outline.svg';
        this.setTrack({
          url: `https://lostpointer.site/src/static/tracks/${current.dataset.url}`,
          cover: `/src/static/img/artworks/${current.dataset.cover}`,
          title: current.dataset.title,
          artist: current.dataset.artist,
          album: current.dataset.album,
        });
      }
    };

    navigator.mediaSession.setActionHandler('previoustrack', this.switchTrackHandler);
    navigator.mediaSession.setActionHandler('nexttrack', this.switchTrackHandler);
  }

  seek(xPos) {
    const seek = (xPos - this.seekbarPos.left) / this.seekbarPos.width;
    this.seekbarCurrent.style.width = `${seek * 100}%`;
    this.player.currentTime = this.player.duration * seek;
  }

  volume(xPos) {
    const vol = (xPos - this.volumePos.left) / this.volumePos.width;
    this.currentVolume.style.width = `${vol * 100}%`;
    this.player.volume = vol;
    window.localStorage.setItem('playerVolume', `${vol}`);
  }

  saveLastPlayed() {
    window.localStorage.setItem('lastPlayedData', JSON.stringify(this.data));
  }

  getLastPlayed() {
    const data = window.localStorage.getItem('lastPlayedData');
    if (data) {
      const json = JSON.parse(data);
      json.playing = false;
      this.data = json;
      this.player.src = this.data.url;
    }
    return typeof data === 'string';
  }

  setTrack(track) {
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
      url: track.url,
      playing: true,
    };

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [
        { src: `${track.cover}_96px.webp`, sizes: '96x96', type: 'image/webp' },
        { src: `${track.cover}_128px.webp`, sizes: '128x128', type: 'image/webp' },
        { src: `${track.cover}_192px.webp`, sizes: '192x192', type: 'image/webp' },
        { src: `${track.cover}_256px.webp`, sizes: '256x256', type: 'image/webp' },
        { src: `${track.cover}_384px.webp`, sizes: '384x384', type: 'image/webp' },
        { src: `${track.cover}_512px.webp`, sizes: '512x512', type: 'image/webp' },
      ],
    });

    this.player.play();
    this.saveLastPlayed();
  }

  unmount() {
    this.removeEventListeners(); // Вообще ничего не делает, но должно
    this.player.pause();
  }

  toggle() {
    this.data.playing = !this.data.playing;
    this.data.playing ? this.player.play() : this.player.pause();
  }

  setEventListeners() {
    document.querySelector('.repeat').addEventListener('click', this.buttonsHandler);
    document.querySelector('.shuffle').addEventListener('click', this.buttonsHandler);
    document.querySelector('.mute').addEventListener('click', this.buttonsHandler);
    window.addEventListener('resize', this.resizeListener);
    document.querySelector('.player__seekbar').addEventListener('click', this.seekbarHandler);
    document.querySelector('.player-volume').addEventListener('click', this.volumeHandler);
    document.querySelector('.player-play').addEventListener('click', this.playButtonHandler);
    this.player.addEventListener('timeupdate', this.timeUpdateHandler);
    this.player.addEventListener('pause', this.pauseHandler);
    this.player.addEventListener('play', this.playHandler);
  }

  removeEventListeners() {
    this.player.removeEventListener('timeupdate', this.timeUpdateHandler);
    document.querySelector('.repeat').removeEventListener('click', this.buttonsHandler);
    document.querySelector('.shuffle').removeEventListener('click', this.buttonsHandler);
    document.querySelector('.mute').removeEventListener('click', this.buttonsHandler);
    window.removeEventListener('resize', this.resizeListener, true);
    document.querySelector('.player__seekbar').removeEventListener('click', this.seekbarHandler);
    document.querySelector('.player-play').removeEventListener('click', this.playButtonHandler);
    this.player.removeEventListener('pause', this.pauseHandler);
    this.player.removeEventListener('play', this.playHandler);
  }

  setup() {
    this.seekbarCurrent = document.querySelector('.seekbar-current');
    this.currentVolume = document.querySelector('.volume-current');
    this.seekbarPos = document.querySelector('.player__seekbar').getBoundingClientRect();
    this.volumePos = document.querySelector('.player-volume').getBoundingClientRect();
    this.mute = document.querySelector('.mute');
    this.repeatToggle = document.querySelector('.repeat');

    const vol = parseFloat(window.localStorage.getItem('playerVolume'));
    if (!Number.isNaN(vol)) {
      this.player.volume = vol;
      this.currentVolume.style.width = `${vol * 100}%`;
    }
    this.player.muted = window.localStorage.getItem('playerMuted') === 'true';
    if (this.player.muted) {
      this.mute.classList.add('enabled');
      this.mute.src = '/src/static/img/muted.svg';
    }

    this.player.loop = window.localStorage.getItem('playerLooped') === 'true';
    this.player.loop ? this.repeatToggle.classList.add('enabled') : this.repeatToggle.classList.remove('enabled');

    this.setEventListeners();
  }

  render() {
    if (this.renderedOnce) {
      this.removeEventListeners();
    }
    this.template = Handlebars.templates['player.hbs'](this.data);
    const player = document.querySelector('.player');
    const app = document.querySelector('.app');
    if (player) {
      player.remove();
      app.insertAdjacentHTML('beforeend', this.getHtml());
      this.setup();
    }
    this.renderedOnce = true;
  }
}

export { PlayerComponent };
