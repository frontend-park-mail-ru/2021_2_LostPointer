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
    this.addHandlers();
    this.firstTime = true;
    this.player.loop = false;
    this.gotSeekPos = false;
    this.gotVolPos = false;
    this.data.playing = false;
  }

  seek(xPos) {
    if (!this.gotSeekPos) {
      this.seekbarPos = document.getElementById('player-seekbar').getBoundingClientRect();
      this.gotSeekPos = true;
    }
    const seek = (xPos - this.seekbarPos.left) / this.seekbarPos.width;
    this.seekbarCurrent.style.width = `${seek * 100}%`;
    this.player.currentTime = this.player.duration * seek;
  }

  volume(xPos) {
    if (!this.gotVolPos) {
      this.volumePos = document.getElementById('player-volume').getBoundingClientRect();
      this.gotVolPos = true;
    }
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
      this.player.currentTime = this.data.playerCurrentTime;
      this.player.src = this.data.url;
      this.data.right_disabled = true;
      this.data.left_disabled = true;
    }
    return typeof data === 'string';
  }

  setTrack(track) {
    this.player.pause();
    this.player.src = track.url;
    this.data = {
      cover: track.cover,
      track: track.title,
      artist: track.artist,
      url: track.url,
      playing: true,
    };

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [96, 128, 192, 256, 384, 512].reduce((acc, elem) => {
        acc.push({ src: `${track.cover}_${elem}px.webp`, sizes: `${elem}x${elem}`, type: 'image/webp' });
        return acc;
      }, []),
    });

    const right = document.getElementById('player-skip-right');
    const left = document.getElementById('player-skip-left');

    right.classList.remove('disabled');
    left.classList.remove('disabled');

    this.data.right_disabled = this.pos === this.playlist.length - 1;
    this.data.left_disabled = this.pos === 0;

    if (this.data.left_disabled) {
      left.classList.add('disabled');
    }
    if (this.data.right_disabled) {
      right.classList.add('disabled');
    }

    this.player.play();
  }

  unmount() {
    this.removeEventListeners();
    this.player.pause();
  }

  toggle() {
    this.data.playing = !this.data.playing;
    this.data.playing ? this.player.play() : this.player.pause();
  }

  setEventListeners() {
    this.player.addEventListener('loadedmetadata', () => {
      const totalSeconds = (this.player.duration % 60) | 0;
      const zero = totalSeconds < 10 ? '0' : '';

      this.data.current_time = '0:00';
      this.data.total_time = `${(this.player.duration / 60) | 0}:${zero}${totalSeconds}`;
      this.data.playing = !this.firstTime;
      this.firstTime = false;
      this.saveLastPlayed();
      this.update();
    });
    document.querySelector('.repeat').addEventListener('click', this.buttonsHandler);
    document.querySelector('.shuffle').addEventListener('click', this.buttonsHandler);
    document.querySelector('.mute').addEventListener('click', this.buttonsHandler);
    window.addEventListener('resize', this.resizeHandler);
    document.querySelector('.player__seekbar').addEventListener('click', this.seekbarHandler);
    document.querySelector('.player-volume').addEventListener('click', this.volumeHandler);
    document.querySelector('.player-play').addEventListener('click', this.playButtonHandler);
    this.player.addEventListener('timeupdate', this.timeUpdateHandler);
    this.player.addEventListener('pause', this.pauseHandler);
    this.player.addEventListener('play', this.playHandler);
    this.player.addEventListener('ended', this.endedHandler);
    document.querySelector('.player-skip-left').addEventListener('click', this.arrowKeysHandler);
    document.querySelector('.player-skip-right').addEventListener('click', this.arrowKeysHandler);

    navigator.mediaSession.setActionHandler('previoustrack', this.switchTrackHandler);
    navigator.mediaSession.setActionHandler('nexttrack', this.switchTrackHandler);
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
    this.player.removeEventListener('ended', this.endedHandler);
    document.querySelector('.player-skip-left').removeEventListener('click', this.arrowKeysHandler);
    document.querySelector('.player-skip-right').removeEventListener('click', this.arrowKeysHandler);
  }

  setup() {
    this.seekbarCurrent = document.querySelector('.seekbar-current');
    this.currentVolume = document.querySelector('.volume-current');
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
    this.template = Handlebars.templates['player.hbs'](this.data);
    const player = document.querySelector('.player');
    const app = document.querySelector('.app');
    if (player) {
      player.remove();
      app.insertAdjacentHTML('beforeend', this.getHtml());
      this.setup();
    }
  }

  addHandlers() {
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
      this.data.current_time = `${(this.player.currentTime / 60) | 0}:${zero}${seconds}`;
      document.getElementById('player-time-current').innerHTML = this.data.current_time;
      this.data.playerCurrentTime = this.player.currentTime;
      this.saveLastPlayed();
    };
    this.resizeHandler = () => {
      this.seekbarPos = document.querySelector('.player__seekbar').getBoundingClientRect();
      this.volumePos = document.querySelector('.player-volume').getBoundingClientRect();
    };
    this.switchTrackHandler = (e) => {
      this.switchTrack(e.action === 'nexttrack');
    };

    this.arrowKeysHandler = (e) => {
      this.switchTrack(e.target.classList.contains('player-skip-right'));
    };
    this.endedHandler = () => {
      this.switchTrack(true);
    };
  }

  switchTrack(next) {
    let current;
    let allowed = false;
    if (next) {
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
        url: `/src/static/tracks/${current.dataset.url}`,
        cover: `/src/static/img/artworks/${current.dataset.cover}`,
        title: current.dataset.title,
        artist: current.dataset.artist,
        album: current.dataset.album,
      });
    }
  }

  update() {
    document.getElementById('artist-name').innerHTML = this.data.artist ?? '';
    document.getElementById('track-name').innerHTML = this.data.track ?? '';
    document.getElementById('player-time-total').innerHTML = this.data.total_time ?? '';
    document.getElementById('player-artwork').src = `${this.data.cover}_128px.webp`;
  }
}

export { PlayerComponent };
