import { Component } from 'components/Component/component';

import Request from 'services/request/request';

import PlayerTemplate from './player.hbs';
import './player.scss';

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
    artwork_color: string;
}

export class PlayerComponent extends Component<IPlayerComponentProps> {
    pos: number;
    playlist: HTMLElement[];
    nowPlaying: HTMLImageElement;
    currentHandler: EventListenerOrEventListenerObject;
    private audio: HTMLAudioElement;
    private firstTime: boolean;
    private gotSeekPos: boolean;
    private gotVolPos: boolean;
    private seekbarPos: DOMRect;
    private volumePos: DOMRect;
    private currentVolume: HTMLElement;
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
    private playlistIndices: number[];
    private mute: HTMLImageElement;
    private shuffle: boolean;
    private counted: boolean;
    private seekbarMobileCurrent: HTMLElement;

    constructor(props?: IPlayerComponentProps) {
        super(props);
        this.audio = new Audio();
        this.audio.preload = 'auto';
        if (!this.getLastPlayed()) {
            this.props = {
                hide_artwork: true,
                playButton: document.querySelector(
                    '.player-play'
                ) as HTMLImageElement,
            } as IPlayerComponentProps;
        }

        this.firstTime = true;
        this.audio.loop = false;
        this.gotSeekPos = false;
        this.gotVolPos = false;
        this.props.playing = false;
    }

    seek(xPos) {
        if (!this.gotSeekPos) {
            this.seekbarPos = document
                .getElementById('player-seekbar')
                .getBoundingClientRect();
            this.gotSeekPos = true;
        }
        const seek = (xPos - this.seekbarPos.left) / this.seekbarPos.width;
        document.documentElement.style.setProperty(
            '--seekbar-current',
            `${seek * 100}%`
        );
        this.audio.currentTime = this.audio.duration * seek;
    }

    volume(xPos) {
        if (!this.gotVolPos) {
            this.volumePos = document
                .getElementById('player-volume')
                .getBoundingClientRect();
            this.gotVolPos = true;
        }
        const vol = (xPos - this.volumePos.left) / this.volumePos.width;
        this.currentVolume.style.width = `${vol * 100}%`;
        this.audio.volume = vol;
        window.localStorage.setItem('playerVolume', `${vol}`);
    }

    saveLastPlayed() {
        if (this.props.playing) {
            window.localStorage.setItem(
                'lastPlayedData',
                JSON.stringify(this.props)
            );
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
            this.audio.preload = 'metadata';
        }
        return typeof data === 'string';
    }

    setTrack(track): void {
        this.audio.pause();
        this.counted = false;
        this.audio.src = track.url;
        this.props = {
            cover: track.cover,
            track: track.title,
            artist: track.artist,
            url: track.url,
            artwork_color: track.artwork_color,
        } as IPlayerComponentProps;

        document.title = `${track.title} · ${track.artist}`;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artist,
            album: track.album,
            artwork: [96, 128, 192, 256, 384, 512].reduce((acc, elem) => {
                acc.push({
                    src: `${track.cover}_${elem}px.webp`,
                    sizes: `${elem}x${elem}`,
                    type: 'image/webp',
                });
                return acc;
            }, []),
        });

        const right = document.querySelectorAll('.player-skip-right');
        const left = document.querySelectorAll('.player-skip-left');

        right.forEach((arrow) => {
            arrow.classList.remove('disabled');
        });

        left.forEach((arrow) => {
            arrow.classList.remove('disabled');
        });

        this.props.right_disabled = this.pos === this.playlist.length - 1;
        this.props.left_disabled = this.pos === 0;

        if (this.props.left_disabled) {
            left.forEach((arrow) => {
                arrow.classList.add('disabled');
            });
        }
        if (this.props.right_disabled) {
            right.forEach((arrow) => {
                arrow.classList.add('disabled');
            });
        }

        this.audio.play().then(() => (this.props.playing = true));
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
            const totalSeconds = this.audio.duration % 60 | 0;
            const zero = totalSeconds < 10 ? '0' : '';

            this.props.current_time = '0:00';
            this.props.total_time = `${
                (this.audio.duration / 60) | 0
            }:${zero}${totalSeconds}`;
            this.props.playing = !this.firstTime;

            this.firstTime = false;
            this.saveLastPlayed();
            this.update();

            document
                .querySelector('.player-artwork')
                .classList.remove('hidden');
        });
        document
            .querySelector('.repeat')
            .addEventListener('click', this.buttonsHandler);
        document
            .querySelector('.shuffle')
            .addEventListener('click', this.buttonsHandler);
        document
            .querySelector('.mute')
            .addEventListener('click', this.buttonsHandler);
        window.addEventListener('resize', this.resizeHandler);
        document
            .querySelector('.player__seekbar')
            .addEventListener('click', this.seekbarHandler);
        const mobileSeekbar = document.querySelector(
            '.mobile-player__progress__bar'
        );
        if (mobileSeekbar) {
            mobileSeekbar.addEventListener('click', this.seekbarHandler);
        }
        document
            .querySelector('.player-volume')
            .addEventListener('click', this.volumeHandler);
        document.querySelectorAll('.player-play').forEach((play) => {
            play.addEventListener('click', this.playButtonHandler);
        });

        this.audio.addEventListener('timeupdate', this.timeUpdateHandler);
        this.audio.addEventListener('pause', this.pauseHandler);
        this.audio.addEventListener('play', this.playHandler);
        this.audio.addEventListener('ended', this.endedHandler);
        document
            .querySelectorAll('.player-skip-left')
            .forEach((arrow) =>
                arrow.addEventListener('click', this.arrowKeysHandler)
            );
        document
            .querySelectorAll('.player-skip-right')
            .forEach((arrow) =>
                arrow.addEventListener('click', this.arrowKeysHandler)
            );

        navigator.mediaSession.setActionHandler(
            'previoustrack',
            this.switchTrackHandler
        );
        navigator.mediaSession.setActionHandler(
            'nexttrack',
            this.switchTrackHandler
        );
    }

    removeEventListeners() {
        this.audio.removeEventListener('timeupdate', this.timeUpdateHandler);
        const repeat = document.querySelector('.repeat');
        repeat.removeEventListener('click', this.buttonsHandler);
        const shuffle = document.querySelector('.shuffle');
        shuffle.removeEventListener('click', this.buttonsHandler);
        const mute = document.querySelector('.mute');
        mute.removeEventListener('click', this.buttonsHandler);
        window.removeEventListener('resize', this.resizeHandler);
        document
            .querySelector('.player__seekbar')
            .removeEventListener('click', this.seekbarHandler);
        document
            .querySelector('.player-play')
            .removeEventListener('click', this.playButtonHandler);
        this.audio.removeEventListener('pause', this.pauseHandler);
        this.audio.removeEventListener('play', this.playHandler);
        this.audio.removeEventListener('ended', this.endedHandler);
        document
            .querySelector('.player-skip-left')
            .removeEventListener('click', this.arrowKeysHandler);
        document
            .querySelector('.player-skip-right')
            .removeEventListener('click', this.arrowKeysHandler);
    }

    setup(playlist) {
        this.currentVolume = document.querySelector('.volume-current');
        this.mute = document.querySelector('.mute');
        this.repeatToggle = document.querySelector('.repeat');

        const vol = parseFloat(window.localStorage.getItem('playerVolume'));
        if (!Number.isNaN(vol)) {
            this.audio.volume = vol;
            this.currentVolume.style.width = `${vol * 100}%`;
        }
        const seekbarWidth = `${
            (this.audio.currentTime / this.audio.duration) * 100
        }%`;
        document.documentElement.style.setProperty(
            '--seekbar-current',
            seekbarWidth
        );
        if (this.seekbarMobileCurrent) {
            this.seekbarMobileCurrent.style.width = seekbarWidth;
        }
        this.audio.muted =
            window.localStorage.getItem('playerMuted') === 'true';
        if (this.audio.muted) {
            this.mute.classList.add('enabled');
            this.mute.src = '/static/img/muted.svg';
        }

        this.audio.loop =
            window.localStorage.getItem('playerLooped') === 'true';
        this.audio.loop
            ? this.repeatToggle.classList.add('enabled')
            : this.repeatToggle.classList.remove('enabled');

        this.setEventListeners();

        this.playlist = playlist;
        this.playlistIndices = [...Array(this.playlist.length).keys()];
    }

    render() {
        return PlayerTemplate(this.props);
    }

    addHandlers() {
        console.log('added player handlers');
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
                this.audio.loop
                    ? element.classList.add('enabled')
                    : element.classList.remove('enabled');
                window.localStorage.setItem(
                    'playerLooped',
                    `${this.audio.loop}`
                );
            } else if (element.classList.contains('shuffle')) {
                this.shuffle = !element.classList.contains('enabled');
                this.pos = -1;
                if (this.shuffle) {
                    element.classList.add('enabled');
                    shuffle(this.playlistIndices);
                } else {
                    element.classList.remove('enabled');
                    this.playlistIndices = [
                        ...Array(this.playlist.length).keys(),
                    ];
                }
            } else if (element.classList.contains('mute')) {
                this.audio.muted = !this.audio.muted;
                this.audio.muted
                    ? element.classList.add('enabled')
                    : element.classList.remove('enabled');
                window.localStorage.setItem(
                    'playerMuted',
                    `${this.audio.muted}`
                );
                (element as HTMLImageElement).src = `/static/img/${
                    this.audio.muted ? 'muted.svg' : 'volume.svg'
                }`;
            }
        };
        this.playHandler = () => {
            document.querySelectorAll('.player-play').forEach((play) => {
                (<HTMLImageElement>play).src = '/static/img/pause.svg';
            });
            if (this.nowPlaying) {
                this.nowPlaying.src = '/static/img/pause-outline.svg';
            }
        };
        this.pauseHandler = () => {
            document.querySelectorAll('.player-play').forEach((play) => {
                (<HTMLImageElement>play).src = '/static/img/play.svg';
            });
            if (this.nowPlaying) {
                this.nowPlaying.src = '/static/img/play-outline.svg';
            }
        };
        this.seekbarHandler = (e: MouseEvent) => this.seek(e.x);
        this.volumeHandler = (e: MouseEvent) => this.volume(e.x);
        this.playButtonHandler = () => {
            this.props.playing ? this.audio.pause() : this.audio.play();
            this.props.playing = !this.props.playing;
        };
        this.timeUpdateHandler = () => {
            if (
                this.nowPlaying &&
                this.audio.currentTime / this.audio.duration > 0.35 &&
                !this.counted
            ) {
                Request.post(
                    '/inc_listencount',
                    JSON.stringify({ id: parseInt(this.nowPlaying.dataset.id) })
                ).then(() => {
                    this.counted = true;
                });
            }
            const seconds = this.audio.currentTime % 60 | 0;
            const zero = seconds < 10 ? '0' : '';
            const fraction = this.audio.currentTime / this.audio.duration || 0;
            document.documentElement.style.setProperty(
                '--seekbar-current',
                `${fraction * 100}%`
            );
            this.props.current_time = `${
                (this.audio.currentTime / 60) | 0
            }:${zero}${seconds}`;
            document.getElementById('player-time-current').innerHTML =
                this.props.current_time;
            const mobileTime = document.querySelector(
                '.mobile-player__progress__time__elapsed'
            );
            if (mobileTime) {
                mobileTime.innerHTML = this.props.current_time;
            }
            this.props.playerCurrentTime = this.audio.currentTime;
            this.saveLastPlayed();
        };
        this.resizeHandler = () => {
            this.seekbarPos = document
                .querySelector('.player__seekbar')
                .getBoundingClientRect();
            this.volumePos = document
                .querySelector('.player-volume')
                .getBoundingClientRect();
        };
        this.switchTrackHandler = (e: MediaSessionActionDetails) => {
            this.switchTrack(e.action === 'nexttrack');
        };

        this.arrowKeysHandler = (e) => {
            if (!(<HTMLImageElement>e.target).classList.contains('disabled')) {
                this.switchTrack(
                    (e.target as HTMLElement).classList.contains(
                        'player-skip-right'
                    )
                );
            }
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
        const prev =
            this.nowPlaying ||
            this.playlist[this.playlistIndices[this.pos]].querySelector(
                '.track-play'
            );
        let allowed = false;
        if (next) {
            if (this.pos < this.playlist.length - 1) {
                this.nowPlaying =
                    this.playlist[
                        this.playlistIndices[++this.pos]
                    ].querySelector('.track-play'); //TODO=Сделать плейлист компонентом + потом отрисовывать
                allowed = true;
            }
        } else if (this.pos >= 1) {
            this.nowPlaying =
                this.playlist[this.playlistIndices[--this.pos]].querySelector(
                    '.track-play'
                );
            allowed = true;
        }
        if (allowed) {
            prev.src = '/static/img/play-outline.svg';
            this.nowPlaying.src = '/static/img/pause-outline.svg';
            this.setTrack({
                url: `/static/tracks/${this.nowPlaying.dataset.url}`,
                cover: `/static/artworks/${this.nowPlaying.dataset.cover}`,
                title: this.nowPlaying.dataset.title,
                artist: this.nowPlaying.dataset.artist,
                album: this.nowPlaying.dataset.album,
                artwork_color: this.nowPlaying.dataset.artworkcolor,
            });
        }
    }

    update() {
        const artist = document.getElementById('artist-name');
        if (artist) {
            artist.innerHTML = this.props.artist || '';
        }
        const track = document.getElementById('track-name');
        if (track) {
            track.innerHTML = this.props.track || '';
        }
        const mobileTrack = document.querySelectorAll('.mobile-track-title');
        if (mobileTrack) {
            mobileTrack.forEach((title) => {
                title.innerHTML = this.props.track || '';
            });
        }
        const mobileArtist = document.querySelectorAll('.mobile-track-artist');
        if (mobileArtist) {
            mobileArtist.forEach((artist) => {
                artist.innerHTML = this.props.artist || '';
            });
        }
        const totalTime = document.getElementById('player-time-total');
        if (totalTime) {
            totalTime.innerHTML = this.props.total_time || '';
        }
        const totalTimeMobile = document.querySelector(
            '.mobile-player__progress__time__remaining'
        );
        if (totalTimeMobile) {
            totalTimeMobile.innerHTML = this.props.total_time || '';
        }
        const artwork = <HTMLImageElement>(
            document.getElementById('player-artwork')
        );
        const mobileArtwork = <HTMLImageElement>(
            document.getElementById('mobile-player-artwork')
        );
        if (this.props.hide_artwork) {
            if (artwork) {
                artwork.classList.add('hidden');
                return;
            }
        }
        artwork.src = `${this.props.cover}_128px.webp`;
        if (mobileArtwork) {
            mobileArtwork.src = `${this.props.cover}_512px.webp`;
        }
        document.documentElement.style.setProperty(
            '--artwork-accent-color',
            this.props.artwork_color
        );
    }

    stop() {
        this.audio.pause();
        this.audio.src = null;
        const playButton = <HTMLImageElement>(
            document.querySelector('.player-play')
        );
        if (playButton) {
            playButton.src = '/static/img/play.svg'; //TODO=Почему хэндлер паузы это не отрабатывает - большой вопрос
        }
        if (this.nowPlaying) {
            this.nowPlaying.src = '/static/img/play-outline.svg';
        }
        this.update();
        localStorage.removeItem('lastPlayedData');
    }

    clear() {
        this.audio.pause();
        this.audio.src = '';
        this.props = {
            artwork_color: '#000',
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
            recovered: false,
        };
        (<HTMLElement>document.querySelector('.seekbar-current')).style.width =
            '0';
        this.update();
    }

    setPos(pos: number, element: HTMLImageElement) {
        this.pos = pos;
        this.nowPlaying = element;
    }
}

export default new PlayerComponent();
