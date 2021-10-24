import { Component } from 'components/component/component';

import PlayerTemplate from './player.hbs';

interface IPlayerComponentProps {
    recovered: boolean;
    total_time: string;
    current_time: string;
    playing: boolean;
    artist: string;
    track: string;
    left_disabled: boolean;
    right_disabled: boolean;
    url: string;
    playerCurrentTime: number;
    cover: string;
    playButton: HTMLImageElement;
    hide_artwork: boolean;
}

export class PlayerComponent extends Component<IPlayerComponentProps> {
    private audio: HTMLAudioElement;
    private firstTime: boolean;
    private gotSeekPos: boolean;
    private gotVolPos: boolean;
    private seekbarPos: DOMRect;
    private seekbarCurrent: HTMLElement;
    private volumePos: DOMRect;
    private currentVolume: HTMLElement;
    pos: number;
    playlist: HTMLElement[];

    private buttonsHandler: EventListenerOrEventListenerObject;
    private resizeHandler: EventListenerOrEventListenerObject;
    private seekbarHandler: EventListenerOrEventListenerObject;
    private volumeHandler: EventListenerOrEventListenerObject;
    private timeUpdateHandler: EventListenerOrEventListenerObject;
    private playButtonHandler: EventListenerOrEventListenerObject;
    private pauseHandler: EventListenerOrEventListenerObject;
    private playHandler: EventListenerOrEventListenerObject;
    private endedHandler: EventListenerOrEventListenerObject;
    private arrowKeysHandler: EventListenerOrEventListenerObject;
    private switchTrackHandler: (e: MediaSessionActionDetails) => void;

    private repeatToggle: HTMLImageElement;
    nowPlaying: HTMLImageElement;
    private playlistIndices: number[];
    currentHandler: EventListenerOrEventListenerObject;
    private mute: HTMLImageElement;
    private shuffle: boolean;


    constructor(props?: IPlayerComponentProps) {
        super(props);
        this.audio = new Audio();
        this.audio.preload = 'auto';
        if (!this.getLastPlayed()) {
            this.props = {
                hide_artwork: true,
                playButton: (document.querySelector('.player-play') as HTMLImageElement)
            } as IPlayerComponentProps;
        }
        this.addHandlers();
        this.firstTime = true;
        this.audio.loop = false;
        this.gotSeekPos = false;
        this.gotVolPos = false;
        this.props.playing = false;
    }

    seek(xPos) {
        if (!this.gotSeekPos) {
            this.seekbarPos = document.getElementById('player-seekbar').getBoundingClientRect();
            this.gotSeekPos = true;
        }
        const seek = (xPos - this.seekbarPos.left) / this.seekbarPos.width;
        this.seekbarCurrent.style.width = `${seek * 100}%`;
        this.audio.currentTime = this.audio.duration * seek;
    }

    volume(xPos) {
        if (!this.gotVolPos) {
            this.volumePos = document.getElementById('player-volume').getBoundingClientRect();
            this.gotVolPos = true;
        }
        const vol = (xPos - this.volumePos.left) / this.volumePos.width;
        this.currentVolume.style.width = `${vol * 100}%`;
        this.audio.volume = vol;
        window.localStorage.setItem('playerVolume', `${vol}`);
    }

    saveLastPlayed() {
        if (this.props.playing) {
            window.localStorage.setItem('lastPlayedData', JSON.stringify(this.props));
        }
    }

    getLastPlayed(): boolean {
        const data = window.localStorage.getItem('lastPlayedData');
        if (data) {
            const json = JSON.parse(data);
            json.playing = false;
            this.props = json;
            this.audio.currentTime = this.props.playerCurrentTime;
            this.audio.src = this.props.url;
            this.props.right_disabled = true;
            this.props.left_disabled = true;
            document.title = `${this.props.track} · ${this.props.artist}`;
            this.props.hide_artwork = false;
            this.props.recovered = true;
        }
        return typeof data === 'string';
    }

    setTrack(track): void {
        this.audio.pause();
        this.audio.src = track.url;
        this.props = {
            cover: track.cover,
            track: track.title,
            artist: track.artist,
            url: track.url,
            playing: true,
        } as IPlayerComponentProps;

        document.title = `${track.title} · ${track.artist}`;

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

        this.props.right_disabled = this.pos === this.playlist.length - 1;
        this.props.left_disabled = this.pos === 0;

        if (this.props.left_disabled) {
            left.classList.add('disabled');
        }
        if (this.props.right_disabled) {
            right.classList.add('disabled');
        }
        this.audio.play();
    }

    unmount() {
        this.audio.pause();
        this.removeEventListeners();
    }

    toggle() {
        this.props.playing = !this.props.playing;
        this.props.playing ? this.audio.play() : this.audio.pause();
    }

    setEventListeners() {
        this.audio.addEventListener('loadedmetadata', () => {
            const totalSeconds = (this.audio.duration % 60) | 0;
            const zero = totalSeconds < 10 ? '0' : '';

            this.props.current_time = '0:00';
            this.props.total_time = `${(this.audio.duration / 60) | 0}:${zero}${totalSeconds}`;
            this.props.playing = !this.firstTime;

            this.firstTime = false;
            this.saveLastPlayed();
            this.update();
            document.querySelector('.player-artwork').classList.remove('hidden');
        });
        document.querySelector('.repeat').addEventListener('click', this.buttonsHandler);
        document.querySelector('.shuffle').addEventListener('click', this.buttonsHandler);
        document.querySelector('.mute').addEventListener('click', this.buttonsHandler);
        window.addEventListener('resize', this.resizeHandler);
        document.querySelector('.player__seekbar').addEventListener('click', this.seekbarHandler);
        document.querySelector('.player-volume').addEventListener('click', this.volumeHandler);
        document.querySelector('.player-play').addEventListener('click', this.playButtonHandler);
        this.audio.addEventListener('timeupdate', this.timeUpdateHandler);
        this.audio.addEventListener('pause', this.pauseHandler);
        this.audio.addEventListener('play', this.playHandler);
        this.audio.addEventListener('ended', this.endedHandler);
        document.querySelector('.player-skip-left').addEventListener('click', this.arrowKeysHandler);
        document.querySelector('.player-skip-right').addEventListener('click', this.arrowKeysHandler);

        navigator.mediaSession.setActionHandler('previoustrack', this.switchTrackHandler);
        navigator.mediaSession.setActionHandler('nexttrack', this.switchTrackHandler);
    }

    removeEventListeners() {
        this.audio.removeEventListener('timeupdate', this.timeUpdateHandler);
        document.querySelector('.repeat').removeEventListener('click', this.buttonsHandler);
        document.querySelector('.shuffle').removeEventListener('click', this.buttonsHandler);
        document.querySelector('.mute').removeEventListener('click', this.buttonsHandler);
        window.removeEventListener('resize', this.resizeHandler);
        document.querySelector('.player__seekbar').removeEventListener('click', this.seekbarHandler);
        document.querySelector('.player-play').removeEventListener('click', this.playButtonHandler);
        this.audio.removeEventListener('pause', this.pauseHandler);
        this.audio.removeEventListener('play', this.playHandler);
        this.audio.removeEventListener('ended', this.endedHandler);
        document.querySelector('.player-skip-left').removeEventListener('click', this.arrowKeysHandler);
        document.querySelector('.player-skip-right').removeEventListener('click', this.arrowKeysHandler);
    }

    setup(playlist) {
        this.seekbarCurrent = document.querySelector('.seekbar-current');
        this.currentVolume = document.querySelector('.volume-current');
        this.mute = document.querySelector('.mute');
        this.repeatToggle = document.querySelector('.repeat');

        const vol = parseFloat(window.localStorage.getItem('playerVolume'));
        if (!Number.isNaN(vol)) {
            this.audio.volume = vol;
            this.currentVolume.style.width = `${vol * 100}%`;
        }
        this.audio.muted = window.localStorage.getItem('playerMuted') === 'true';
        if (this.audio.muted) {
            this.mute.classList.add('enabled');
            this.mute.src = '/src/static/img/muted.svg';
        }

        this.audio.loop = window.localStorage.getItem('playerLooped') === 'true';
        this.audio.loop ? this.repeatToggle.classList.add('enabled') : this.repeatToggle.classList.remove('enabled');

        this.setEventListeners();

        this.playlist = playlist;
        this.playlistIndices = [...Array(this.playlist.length).keys()];
    }

    render() {
        return PlayerTemplate(this.props);
    }

    addHandlers() {
        const shuffle = (array) => {
            let i = array.length;
            let temporaryValue;
            let randomIndex;
            while (i !== 0) {
                randomIndex = Math.floor(Math.random() * i);
                temporaryValue = array[--i];
                array[i] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
        };
        this.buttonsHandler = (e: Event) => {
            const element = e.target as HTMLElement;
            if (element.classList.contains('repeat')) {
                this.audio.loop = !element.classList.contains('enabled');
                this.audio.loop ? element.classList.add('enabled') : element.classList.remove('enabled');
                window.localStorage.setItem('playerLooped', `${this.audio.loop}`);
            } else if (element.classList.contains('shuffle')) {
                this.shuffle = !element.classList.contains('enabled'); // TODO
                this.pos = -1;
                if (this.shuffle) {
                    element.classList.add('enabled');
                    shuffle(this.playlistIndices);
                } else {
                    element.classList.remove('enabled');
                    this.playlistIndices = [...Array(this.playlist.length).keys()];
                }
            } else if (element.classList.contains('mute')) {
                this.audio.muted = !this.audio.muted;
                this.audio.muted ? element.classList.add('enabled') : element.classList.remove('enabled');
                window.localStorage.setItem('playerMuted', `${this.audio.muted}`);
                (element as HTMLImageElement).src = `/src/static/img/${this.audio.muted ? 'muted.svg' : 'volume.svg'}`;
            }
        };
        this.playHandler = () => {
            (document.querySelector('.player-play') as HTMLImageElement).src = '/src/static/img/pause.svg';
            if (this.nowPlaying) {
                this.nowPlaying.src = '/src/static/img/pause-outline.svg';
            }
        };
        this.pauseHandler = () => {
            (document.querySelector('.player-play') as HTMLImageElement).src = '/src/static/img/play.svg';
            this.nowPlaying.src = '/src/static/img/play-outline.svg';
        };
        this.seekbarHandler = (e: MouseEvent) => this.seek(e.x);
        this.volumeHandler = (e: MouseEvent) => this.volume(e.x);
        this.playButtonHandler = () => {
            this.props.playing ? this.audio.pause() : this.audio.play();
            this.props.playing = !this.props.playing;
        };
        this.timeUpdateHandler = () => {
            const seconds = (this.audio.currentTime % 60) | 0;
            const zero = seconds < 10 ? '0' : '';
            this.seekbarCurrent.style.width = `${(this.audio.currentTime / this.audio.duration) * 100}%`;
            this.props.current_time = `${(this.audio.currentTime / 60) | 0}:${zero}${seconds}`;
            document.getElementById('player-time-current').innerHTML = this.props.current_time;
            this.props.playerCurrentTime = this.audio.currentTime;
            this.saveLastPlayed();
        };
        this.resizeHandler = () => {
            this.seekbarPos = document.querySelector('.player__seekbar').getBoundingClientRect();
            this.volumePos = document.querySelector('.player-volume').getBoundingClientRect();
        };
        this.switchTrackHandler = (e: MediaSessionActionDetails) => {
            this.switchTrack(e.action === 'nexttrack');
        };

        this.arrowKeysHandler = (e) => {
            this.switchTrack((e.target as HTMLElement).classList.contains('player-skip-right'));
        };
        this.endedHandler = () => {
            this.switchTrack(true);
        };
    }

    switchTrack(next: boolean) {
        if (this.currentHandler) {
            this.audio.removeEventListener('play', this.currentHandler);
            this.audio.removeEventListener('pause', this.currentHandler);
        }
        const prev = this.nowPlaying || this.playlist[this.playlistIndices[this.pos]].querySelector('.track-list-item-play');
        let allowed = false;
        if (next) {
            if (this.pos < this.playlist.length - 1) {
                this.nowPlaying = this.playlist[this.playlistIndices[++this.pos]].querySelector('.track-list-item-play'); //TODO=Сделать плейлист компонентом + потом отрисовывать
                allowed = true;
            }
        } else if (this.pos >= 1) {
            this.nowPlaying = this.playlist[this.playlistIndices[--this.pos]].querySelector('.track-list-item-play');
            allowed = true;
        }
        if (allowed) {
            prev.src = '/src/static/img/play-outline.svg';
            this.nowPlaying.src = '/src/static/img/pause-outline.svg';
            this.setTrack({
                url: `/src/static/tracks/${this.nowPlaying.dataset.url}`,
                cover: `/src/static/img/artworks/${this.nowPlaying.dataset.cover}`,
                title: this.nowPlaying.dataset.title,
                artist: this.nowPlaying.dataset.artist,
                album: this.nowPlaying.dataset.album,
            });
        }
    }

    update() {
        document.getElementById('artist-name').innerHTML = this.props.artist || '';
        document.getElementById('track-name').innerHTML = this.props.track || '';
        document.getElementById('player-time-total').innerHTML = this.props.total_time || '';
        (<HTMLImageElement>document.querySelector('.player-play')).src = `/src/static/img/${this.props.playing ? 'pause' : 'play'}.svg`;
        const artwork = (<HTMLImageElement>document.getElementById('player-artwork'));
        if (this.props.hide_artwork) {
            artwork.classList.add('hidden');
            return;
        }
        artwork.src = `${this.props.cover}_128px.webp`;
    }

    stop() {
        this.audio.pause();
        this.audio.src = null;
        this.update();
        localStorage.removeItem('lastPlayedData');
    }
    clear() {
        this.audio.pause();
        this.audio.src = '';
        this.props = {
            total_time: '',
            current_time: '',
            playing: false,
            artist: '',
            track: '',
            left_disabled: true,
            right_disabled: true,
            url: '',
            playerCurrentTime: 0,
            cover: '',
            playButton: null,
            hide_artwork: true,
            recovered: false
        };
        (<HTMLElement>document.querySelector('.seekbar-current')).style.width = '0';
        this.update();
    }

    setPos(pos: number, element: HTMLImageElement) {
        this.pos = pos;
        this.nowPlaying = element;
    }
}

export default new PlayerComponent();
