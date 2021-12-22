import { Component } from 'components/Component/component';
import Request from 'services/request/request';
import { TrackModel } from 'models/track';
import store from 'services/store/store';
import router from 'services/router/router';
import routerStore from 'services/router/routerStore';
import { ArtistModel } from 'models/artist';
import PlayerTemplate from './player.hbs';
import './player.scss';
import { TrackComponent } from 'components/TrackComponent/track';

const SET_TRACK = 0;
const TIMEUPDATE = 1;
const SWITCH_TRACK = 2;
const PLAY = 3;
const PAUSE = 4;
const SEEK = 5;
const SET_VOLUME = 6;
const MASTER_TAB_CLOSING = 7;
const SHUFFLE = 8;
const REPEAT = 9;
const MUTE = 10;
const LIKE = 11;

const SLAVE_TIMEOUT = 1000;

export interface IPlayerComponentProps {
    artwork_color: string;
    recovered: boolean;
    total_time: string;
    current_time: string;
    playing: boolean;
    artist: ArtistModel;
    track: string;
    track_id: number;
    track_in_favorites: boolean;
    left_disabled: boolean;
    right_disabled: boolean;
    file: string;
    playerCurrentTime: number;
    cover: string;
    playButton: HTMLImageElement;
    hide_artwork: boolean;
}

export class PlayerComponent extends Component<IPlayerComponentProps> {
    pos: number;
    nowPlaying: TrackModel;
    currentHandler: EventListenerOrEventListenerObject;
    eventListenersAlreadySet: boolean;
    private playlist: TrackModel[];
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
    private globalPlayButtonHandler: EventListenerOrEventListenerObject;
    private currentContext: string;
    private bc: BroadcastChannel;
    private handlersSet: boolean;
    private timeElapsed: HTMLElement;
    private timeTotal: HTMLElement;
    private playButton: HTMLImageElement;
    private isSlave: boolean;
    private slaveTimeout: number;
    private slavePaused: boolean;
    private slaveCurrentTime: number;
    private ignorePauseEvent: boolean;
    private switchTrackDebounce: boolean;

    constructor(props?: IPlayerComponentProps) {
        super(props);
        this.audio = new Audio();
        this.audio.volume = 0.5;
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
        try {
            this.bc = new BroadcastChannel('lostpointer_player');
        } catch (e) {
            this.bc = null;
        }
        this.handlersSet = false;
    }

    seek(xPos) {
        if (!this.gotSeekPos) {
            this.seekbarPos = document
                .getElementById('player-seekbar')
                .getBoundingClientRect();
            this.gotSeekPos = true;
        }
        const seek = (xPos - this.seekbarPos.left) / this.seekbarPos.width;
        if (this.audio.paused) {
            if (this.bc) {
                this.bc.postMessage({ type: SEEK, pos: seek });
            }
        }
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
        if (this.currentVolume) {
            this.currentVolume.style.width = `${vol * 100}%`;
        } else {
            this.currentVolume = document.querySelector('.volume-current');
            this.currentVolume.style.width = `${vol * 100}%`;
        }
        this.audio.volume = vol;
        window.localStorage.setItem('playerVolume', `${vol}`);
        if (this.bc) {
            this.bc.postMessage({ type: SET_VOLUME, pos: vol });
        }
    }

    saveLastPlayed() {
        // TODO
        if (this.props.playing) {
            window.localStorage.setItem(
                'lastPlayedData',
                JSON.stringify({ pos: this.pos, ...this.props })
            );
        }
    }

    getLastPlayed(): boolean {
        const data = window.localStorage.getItem('lastPlayedData');
        const playlist = JSON.parse(window.localStorage.getItem('playlist'));
        const playlistIndices = JSON.parse(
            window.localStorage.getItem('playlistIndices')
        );
        if (data) {
            const json = JSON.parse(data);
            json.playing = false;
            this.props = json;
            this.audio.currentTime = this.props.playerCurrentTime || 0;
            this.audio.src = this.props.file;
            if (this.props?.artist?.props?.name) {
                document.title = `${this.props.track} · ${this.props?.artist?.props?.name}`;
            } else {
                document.title = 'LostPointer Music';
            }
            this.props.hide_artwork = false;
            this.props.recovered = true;
            this.audio.preload = 'metadata';
            this.pos = json.pos;
            document.documentElement.style.setProperty(
                '--artwork-accent-color',
                this.props.artwork_color
            );

            this.playlistIndices = playlistIndices;
            if (playlist) {
                this.playlist = playlist.reduce((acc, track) => {
                    acc.push(new TrackModel(track.props));
                    return acc;
                }, []);
            }
        }
        return typeof data === 'string';
    }

    setTrack(track: TrackModel): void {
        if (!track) {
            return;
        }
        this.audio.pause();
        this.counted = false;
        this.audio.src = `/static/tracks/${track.props.file}`;
        this.props = {
            cover: `/static/artworks/${
                track.props.cover || track.props.album.props.artwork
            }`,
            track: track.props.title,
            artist: track.props.artist,
            file: this.audio.src,
            artwork_color: track.props.album.props.artwork_color,
            track_id: track.props.id,
            track_in_favorites: track.props.is_in_favorites,
        } as IPlayerComponentProps;
        document.title = `${this.props.track} · ${this.props.artist.props.name}`;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.props.title,
            artist: track.props.artist.props.name,
            album: track.props.album.props.title,
            artwork: [96, 128, 192, 256, 384, 512].reduce((acc, elem) => {
                acc.push({
                    src: `/static/artworks/${track.props.album.props.artwork}_${elem}px.webp`,
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

        document.getElementById('player-artwork').style.display = '';
        document.getElementById('mobile-player-artwork').style.display = '';
        this.audio.play().then(() => {
            this.props.playing = true;
            if (this.bc) {
                this.bc.postMessage({
                    ...this.props,
                    type: SET_TRACK,
                    trackID: this.playlist[this.pos].props.id,
                    audio_src: this.audio.src,
                    likeSrc: (<HTMLImageElement>(
                        document.querySelector('.player-fav')
                    )).src,
                });
            }
        });
    }

    toggle() {
        this.props.playing = !this.props.playing;
        this.props.playing ? this.audio.play() : this.audio.pause();
    }

    setEventListeners() {
        if (this.eventListenersAlreadySet) {
            return;
        }
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
                if (this.bc) {
                    this.bc.postMessage({
                        type: REPEAT,
                        loop: this.audio.loop,
                    });
                }
                this.audio.loop
                    ? element.classList.add('enabled')
                    : element.classList.remove('enabled');
                window.localStorage.setItem(
                    'playerLooped',
                    `${this.audio.loop}`
                );
            } else if (element.classList.contains('shuffle')) {
                this.shuffle = !element.classList.contains('enabled');
                if (this.bc) {
                    this.bc.postMessage({
                        type: SHUFFLE,
                        shuffle: this.shuffle,
                    });
                }
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
                if (this.bc) {
                    this.bc.postMessage({
                        type: MUTE,
                        muted: this.audio.muted,
                    });
                }
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
            } else if (element.classList.contains('player-fav')) {
                TrackComponent.toggleFavor(e, (fav) => {
                    console.log('Callback called');
                    console.log(
                        (<HTMLImageElement>(
                            document.querySelector('.player-fav')
                        )).src
                    );
                    if (this.bc) {
                        this.bc.postMessage({
                            type: LIKE,
                            src: (<HTMLImageElement>(
                                document.querySelector('.player-fav')
                            )).src,
                            fav,
                        });
                    }
                });
            }
        };
        this.playHandler = () => {
            document.querySelectorAll('.player-play').forEach((play) => {
                const button = <HTMLImageElement>play;
                if (button.classList.contains('fa-play')) {
                    button.classList.remove('fa-play');
                    button.classList.add('fa-pause');
                } else {
                    button.src = '/static/img/pause.svg';
                }
            });
            if (this.nowPlaying && this.nowPlaying.props) {
                const nowPlayingButton = <HTMLImageElement>(
                    document.querySelector(
                        `.track-play[data-id="${this.nowPlaying.props.id}"]`
                    )
                );
                if (nowPlayingButton) {
                    nowPlayingButton.src = '/static/img/pause-outline.svg';
                }
            }
            if (this.bc) {
                this.bc.postMessage({
                    ...this.props,
                    type: PLAY,
                });
            }
        };

        this.pauseHandler = () => {
            document.querySelectorAll('.player-play').forEach((play) => {
                const button = <HTMLImageElement>play;
                if (button.classList.contains('fa-pause')) {
                    button.classList.remove('fa-pause');
                    button.classList.add('fa-play');
                } else {
                    button.src = '/static/img/play.svg';
                }
            });
            if (this.nowPlaying) {
                const nowPlayingButton = <HTMLImageElement>(
                    document.querySelector(
                        `.track-play[data-id="${this.nowPlaying.props.id}"]`
                    )
                );
                if (nowPlayingButton) {
                    nowPlayingButton.src = '/static/img/play-outline.svg';
                }
            }
            if (this.bc) {
                this.bc.postMessage({
                    ...this.props,
                    type: PAUSE,
                    playlist: this.playlist,
                    playlistIndices: this.playlistIndices,
                    nowPlaying: this.nowPlaying,
                    currentTime: this.audio.currentTime,
                });
            }
        };
        this.seekbarHandler = (e: MouseEvent) => this.seek(e.x);
        this.volumeHandler = (e: MouseEvent) => this.volume(e.x);
        this.playButtonHandler = (e) => {
            if (this.slavePaused) {
                this.setTrack(this.nowPlaying);
                this.audio.currentTime = this.slaveCurrentTime;
                this.slavePaused = false;
            }
            e.stopPropagation();
            if (this.isSlave) {
                if (this.bc) {
                    this.bc.postMessage({ type: PAUSE });
                }
                return;
            }
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
                    JSON.stringify({ id: this.nowPlaying.props.id })
                ).then(() => {
                    this.counted = true;
                });
            }
            const seconds = this.audio.currentTime % 60 | 0;
            const zero = seconds < 10 ? '0' : '';
            const fraction = this.audio.currentTime / this.audio.duration || 0;
            const seekbarWidth = `${fraction * 100}%`;
            document.documentElement.style.setProperty(
                '--seekbar-current',
                seekbarWidth
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
            if (this.bc) {
                this.bc.postMessage({
                    type: TIMEUPDATE,
                    ...this.props,
                    seekbarWidth,
                    playlist: this.playlist,
                });
            }
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

        document.querySelectorAll('.player-fav').forEach((favorites) => {
            favorites.addEventListener('click', this.buttonsHandler);
        });

        document.querySelectorAll('.repeat').forEach((repeat) => {
            repeat.addEventListener('click', this.buttonsHandler);
        });

        document.querySelectorAll('.shuffle').forEach((shuffle) => {
            shuffle.addEventListener('click', this.buttonsHandler);
        });
        document
            .querySelector('.mute')
            .addEventListener('click', this.buttonsHandler);
        window.addEventListener('resize', this.resizeHandler);
        document
            .querySelector('.player__seekbar')
            .addEventListener('click', this.seekbarHandler);
        const playerElement: HTMLElement =
            document.querySelector('.mobile-player');
        const mobileFooter: HTMLElement = document.querySelector(
            '.mobile-footer__menu'
        );
        document
            .querySelector('.mobile-player__close')
            .addEventListener('click', () => {
                playerElement.classList.add('mobile-player__hidden');
                mobileFooter.classList.remove('mobile-footer__menu__hidden');
            });
        document
            .querySelector('.mobile-footer__player')
            .addEventListener('click', () => {
                playerElement.classList.remove('mobile-player__hidden');
                mobileFooter.classList.add('mobile-footer__menu__hidden');
            });
        document
            .querySelector('.track-fav-mobile')
            .addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                TrackComponent.toggleFavor(e);
            });
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
        if (this.eventListenersAlreadySet) {
            //TODO=Определить правильное положение этого блока в `методе`
            return;
        }
        this.globalPlayButtonHandler = (e) => {
            this.ignorePauseEvent = true;
            setTimeout(() => {
                this.ignorePauseEvent = false;
            }, 1000);
            const target = <HTMLImageElement>e.target;
            if (target.classList.contains('top-album__play')) {
                e.preventDefault();
                if (this.nowPlaying) {
                    const nowPlayingButton = <HTMLImageElement>(
                        document.querySelector(
                            `.track-play[data-id="${this.nowPlaying.props.id}"]`
                        )
                    );
                    if (nowPlayingButton) {
                        nowPlayingButton.dataset.playing = 'false';
                        nowPlayingButton.src = '/static/img/play-outline.svg';
                    }
                }
                if (!store.get('authenticated')) {
                    router.go(routerStore.signin);
                    return;
                }
                TrackModel.getAlbumTracks(target.dataset.id).then((tracks) => {
                    this.setup(tracks);
                    this.setPos(0);
                    this.setTrack(tracks[0]);
                });
                this.currentContext = `/album/${target.dataset.id}`;
                return;
            }
            if (target.className === 'track-play') {
                if (
                    window.location.pathname !== this.currentContext ||
                    window.location.pathname === '/'
                ) {
                    this.currentContext = window.location.pathname;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    this.setup(router.getCurrentView().getTracksContext());
                }
                if (!store.get('authenticated')) {
                    this.eventListenersAlreadySet = false;
                    router.go(routerStore.signin);
                    return;
                }
                if (
                    this.nowPlaying &&
                    this.nowPlaying.props &&
                    target.dataset.id === this.nowPlaying.props.id.toString()
                ) {
                    // Ставим на паузу/продолжаем воспр.
                    this.toggle();
                    return;
                }
                if (this.nowPlaying) {
                    // Переключили на другой трек
                    const nowPlayingButton = <HTMLImageElement>(
                        document.querySelector(
                            `.track-play[data-id="${this.nowPlaying.props.id}"]`
                        )
                    );
                    if (nowPlayingButton) {
                        nowPlayingButton.dataset.playing = 'false';
                        nowPlayingButton.src = '/static/img/play-outline.svg';
                    }
                }

                this.setPos(parseInt(target.dataset.pos, 10));

                target.dataset.playing = 'true';
                target.src = '/static/img/pause-outline.svg';
                if (this.playlist) {
                    console.log(this.playlist);
                    const track = this.playlist?.find(
                        (track) =>
                            track.props.id.toString() === target.dataset.id
                    );
                    this.setTrack(track);
                }
            }
        };
        document.addEventListener('click', this.globalPlayButtonHandler);
        this.eventListenersAlreadySet = true;
        this.timeElapsed = document.getElementById('player-time-current');
        this.timeTotal = document.getElementById('player-time-total');
        if (this.bc) {
            this.bc.onmessage = (event) => {
                if (event.data.current_time) {
                    this.timeElapsed.innerHTML = event.data.current_time;
                }
                switch (event.data.type) {
                    case TIMEUPDATE:
                        console.log('Timeupdate event');
                        this.isSlave = true;
                        window.clearTimeout(this.slaveTimeout);
                        this.slaveTimeout = window.setTimeout(() => {
                            this.isSlave = false;
                        }, SLAVE_TIMEOUT);
                        if (!this.playButton) {
                            this.playButton = <HTMLImageElement>(
                                document.getElementById('player-play')
                            );
                        }
                        if (this.playButton.src !== '/static/img/pause.svg') {
                            this.playButton.src = '/static/img/pause.svg';
                        }
                        this.playlist = event.data.playlist;
                        document.documentElement.style.setProperty(
                            '--seekbar-current',
                            event.data.seekbarWidth
                        );
                        break;
                    case SET_TRACK:
                        this.audio.pause();
                        console.log('Set track event');
                        (<HTMLImageElement>(
                            document.getElementById('player-artwork')
                        )).src = `${event.data.cover}_128px.webp`;
                        document.getElementById('track-name').innerHTML =
                            event.data.track;
                        document.getElementById('artist-name').innerHTML =
                            event.data.artist.props.name;
                        if (event.data.right_disabled) {
                            document
                                .getElementById('player-right')
                                .classList.add('disabled');
                        } else {
                            document
                                .getElementById('player-right')
                                .classList.remove('disabled');
                        }
                        if (event.data.left_disabled) {
                            document
                                .getElementById('player-left')
                                .classList.add('disabled');
                        } else {
                            document
                                .getElementById('player-left')
                                .classList.remove('disabled');
                        }
                        if (!this.playButton) {
                            this.playButton = <HTMLImageElement>(
                                document.getElementById('player-play')
                            );
                        }
                        this.playButton.src = `/static/img/${
                            event.data.playing ? 'pause' : 'play'
                        }.svg`;
                        if (!this.timeTotal) {
                            this.timeTotal = <HTMLImageElement>(
                                document.getElementById('player-time-total')
                            );
                        }
                        this.timeTotal.innerHTML = event.data.total_time;
                        document.title = `${event.data.track} · ${event.data.artist.props.name}`;
                        console.log('data', event.data);
                        (<HTMLElement>(
                            document.querySelector('.player-fav')
                        )).dataset.id = event.data.trackID;
                        (<HTMLImageElement>(
                            document.querySelector('.player-fav')
                        )).src = event.data.likeSrc;
                        break;
                    case SWITCH_TRACK:
                        if (this.switchTrackDebounce) {
                            break;
                        }
                        this.switchTrackDebounce = true;
                        setTimeout(() => {
                            this.switchTrackDebounce = false;
                        }, 500);
                        console.log('Switch track event');
                        this.switchTrack(event.data.next);
                        break;
                    case PLAY:
                        console.log('Play event');
                        if (!this.playButton) {
                            this.playButton = <HTMLImageElement>(
                                document.getElementById('player-play')
                            );
                        }
                        this.playButton.src = `/static/img/pause.svg`;
                        break;
                    case PAUSE:
                        if (this.ignorePauseEvent) {
                            return;
                        }
                        console.log('Pause event');
                        if (!this.playButton) {
                            this.playButton = <HTMLImageElement>(
                                document.getElementById('player-play')
                            );
                        }
                        this.audio.pause();
                        this.setup(event.data.playlist);
                        this.nowPlaying = event.data.nowPlaying;
                        this.playlistIndices = event.data.playlistIndices;
                        this.playButton.src = `/static/img/play.svg`;
                        this.slavePaused = true;
                        this.slaveCurrentTime = event.data.currentTime;
                        break;
                    case SEEK:
                        console.log('Seek event');
                        document.documentElement.style.setProperty(
                            '--seekbar-current',
                            `${event.data.pos * 100}%`
                        );
                        this.audio.currentTime =
                            this.audio.duration * event.data.pos;
                        break;
                    case SET_VOLUME:
                        console.log('Set volume');
                        if (!this.currentVolume) {
                            this.currentVolume =
                                document.querySelector('.volume-current');
                        }
                        this.currentVolume.style.width = `${
                            event.data.pos * 100
                        }%`;
                        this.audio.volume = event.data.pos;
                        window.localStorage.setItem(
                            'playerVolume',
                            `${event.data.pos}`
                        );
                        break;
                    case MASTER_TAB_CLOSING:
                        this.setup(event.data.playlist);

                        this.nowPlaying = event.data.nowPlaying;
                        this.playlistIndices = event.data.playlistIndices;

                        this.setTrack(this.nowPlaying);
                        this.audio.currentTime = event.data.currentTime;

                        console.log('Master tab closing');
                        this.slavePaused = false;
                        break;
                    case SHUFFLE:
                        console.log('Shuffle event');
                        this.shuffle = event.data.shuffle;
                        this.pos = -1;
                        if (this.shuffle) {
                            document
                                .querySelector('.shuffle')
                                .classList.add('enabled');
                            shuffle(this.playlistIndices);
                        } else {
                            document
                                .querySelector('.shuffle')
                                .classList.remove('enabled');
                            this.playlistIndices = [
                                ...Array(this.playlist.length).keys(),
                            ];
                        }
                        break;
                    case REPEAT:
                        console.log('Repeat event');
                        this.audio.loop = event.data.loop;
                        this.audio.loop
                            ? document
                                  .querySelector('.repeat')
                                  .classList.add('enabled')
                            : document
                                  .querySelector('.repeat')
                                  .classList.remove('enabled');
                        window.localStorage.setItem(
                            'playerLooped',
                            `${this.audio.loop}`
                        );
                        break;
                    case MUTE:
                        console.log('Mute event');
                        console.log(event.data);
                        this.audio.muted = event.data.muted;
                        this.audio.muted
                            ? document
                                  .querySelector('.mute')
                                  .classList.add('enabled')
                            : document
                                  .querySelector('.mute')
                                  .classList.remove('enabled');
                        window.localStorage.setItem(
                            'playerMuted',
                            `${this.audio.muted}`
                        );
                        (<HTMLImageElement>(
                            document.querySelector('.mute')
                        )).src = `/static/img/${
                            this.audio.muted ? 'muted.svg' : 'volume.svg'
                        }`;
                        break;
                    case LIKE:
                        console.log('Like event');
                        (<HTMLImageElement>(
                            document.querySelector('.player-fav')
                        )).src = event.data.src;
                        (<HTMLImageElement>(
                            document.querySelector('.player-fav')
                        )).dataset.in_favorites = event.data.fav
                            ? 'true'
                            : null;
                        break;
                }
            };
        }
        window.addEventListener('beforeunload', () => {
            if (!this.audio.paused) {
                if (this.bc) {
                    this.bc.postMessage({
                        type: MASTER_TAB_CLOSING,
                        playlist: this.playlist,
                        playlistIndices: this.playlistIndices,
                        nowPlaying: this.nowPlaying,
                        currentTime: this.audio.currentTime,
                    });
                }
            }
        });
    }

    setup([...playlist]: TrackModel[]) {
        this.currentVolume = document.querySelector('.volume-current');
        this.mute = document.querySelector('.mute');
        this.repeatToggle = document.querySelector('.repeat');

        const vol = parseFloat(window.localStorage.getItem('playerVolume'));
        if (!Number.isNaN(vol)) {
            this.audio.volume = vol;
            this.currentVolume &&
                (this.currentVolume.style.width = `${vol * 100}%`);
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

        window.localStorage.setItem(
            'playlist',
            JSON.stringify(
                this.playlist.reduce((acc, track) => {
                    const t = { ...track };
                    delete t.props.album.props.tracks; // Иначе цикл
                    delete t.props.artist.props.tracks;
                    acc.push(t);
                    return acc;
                }, [])
            )
        );
        window.localStorage.setItem(
            'playlistIndices',
            JSON.stringify(this.playlistIndices)
        );
    }

    render() {
        return PlayerTemplate(this.props);
    }

    getNowPlaying(): IPlayerComponentProps {
        return this.props;
    }

    switchTrack(next: boolean) {
        if (this.audio.paused) {
            if (this.bc) {
                this.bc.postMessage({ type: SWITCH_TRACK, next });
            }
            return;
        }
        if (this.currentHandler) {
            this.audio.removeEventListener('play', this.currentHandler);
            this.audio.removeEventListener('pause', this.currentHandler);
        }
        const prev =
            this.nowPlaying || this.playlist[this.playlistIndices[this.pos]];
        let allowed = false;
        if (next) {
            if (this.pos < this.playlist.length - 1) {
                const nowPlaying =
                    this.playlist[this.playlistIndices[++this.pos]];
                if (nowPlaying) {
                    this.nowPlaying = nowPlaying;
                    allowed = true;
                }
            }
        } else if (this.pos >= 1) {
            this.nowPlaying = this.playlist[this.playlistIndices[--this.pos]];
            allowed = true;
        }
        if (allowed && this.nowPlaying.props) {
            const nowPlayingButton = <HTMLImageElement>(
                document.querySelector(
                    `.track-play[data-id="${this.nowPlaying.props.id}"]`
                )
            );
            const prevPlayingButton = <HTMLImageElement>(
                document.querySelector(
                    `.track-play[data-id="${prev.props.id}"]`
                )
            );
            if (prevPlayingButton) {
                prevPlayingButton.src = '/static/img/play-outline.svg';
            }
            if (nowPlayingButton) {
                nowPlayingButton.src = '/static/img/pause-outline.svg';
            }
            this.setTrack(this.nowPlaying);
        }
    }

    update() {
        const artist = document.getElementById('artist-name');
        if (artist) {
            artist.innerHTML =
                this.props.artist && this.props.artist.props
                    ? this.props.artist.props.name
                    : '';
        }
        const track = document.getElementById('track-name');
        if (track) {
            track.innerHTML = this.props.track ? this.props.track : '';
        }
        const fav_icon = document.querySelector('.player-fav');
        if (fav_icon) {
            (<HTMLImageElement>fav_icon).setAttribute(
                'data-id',
                String(this.props.track_id)
            );
            if (this.props.track_in_favorites) {
                (<HTMLImageElement>fav_icon).setAttribute(
                    'data-in_favorites',
                    'true'
                );
                (<HTMLImageElement>(
                    fav_icon
                )).src = `${window.location.origin}/static/img/favorite_green.svg`;
            } else {
                (<HTMLImageElement>fav_icon).removeAttribute(
                    'data-in_favorites'
                );
                (<HTMLImageElement>(
                    fav_icon
                )).src = `${window.location.origin}/static/img/favorite.svg`;
            }
        }
        const mobile_fav_icon = document.querySelector('.track-fav-mobile');
        if (mobile_fav_icon) {
            (<HTMLImageElement>mobile_fav_icon).setAttribute(
                'data-id',
                String(this.props.track_id)
            );
            if (this.props.track_in_favorites) {
                (<HTMLImageElement>mobile_fav_icon).setAttribute(
                    'data-in_favorites',
                    'true'
                );
                (<HTMLImageElement>(
                    mobile_fav_icon
                )).src = `${window.location.origin}/static/img/favorite_green.svg`;
            } else {
                (<HTMLImageElement>mobile_fav_icon).removeAttribute(
                    'data-in_favorites'
                );
                (<HTMLImageElement>(
                    mobile_fav_icon
                )).src = `${window.location.origin}/static/img/favorite.svg`;
            }
        }
        const mobileTrack = document.querySelectorAll('.mobile-track-title');
        if (mobileTrack) {
            mobileTrack.forEach((title) => {
                title.innerHTML = this.props.track ? this.props.track : '';
            });
        }
        const mobileArtist = document.querySelectorAll('.mobile-track-artist');
        if (mobileArtist) {
            mobileArtist.forEach((artist: HTMLElement) => {
                artist.innerHTML =
                    this.props.artist && this.props.artist.props
                        ? this.props.artist.props.name
                        : '';
            });
        }
        const totalTime = document.getElementById('player-time-total');
        if (totalTime) {
            totalTime.innerHTML = this.props.total_time
                ? this.props.total_time
                : '';
        }
        const totalTimeMobile = document.querySelector(
            '.mobile-player__progress__time__remaining'
        );
        if (totalTimeMobile) {
            totalTimeMobile.innerHTML = this.props.total_time
                ? this.props.total_time
                : '';
        }
        const artwork = <HTMLImageElement>(
            document.getElementById('player-artwork')
        );
        const mobileArtwork = <HTMLImageElement>(
            document.getElementById('mobile-player-artwork')
        );
        const right = document.getElementById('player-right');
        const left = document.getElementById('player-left');
        if (this.props.right_disabled) {
            right.classList.add('disabled');
        } else {
            right.classList.remove('disabled');
        }
        if (this.props.left_disabled) {
            left.classList.add('disabled');
        } else {
            left.classList.remove('disabled');
        }
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
        this.playlist = [];
        if (this.audio.paused) {
            return;
        }
        this.audio.pause();
        this.audio.src = null;
        const playButton = <HTMLImageElement>(
            document.querySelector('.player-play')
        );
        if (playButton) {
            this.playButton = playButton;
            playButton.src = '/static/img/play.svg'; //TODO=Почему хэндлер паузы это не отрабатывает - большой вопрос
        }
        if (this.nowPlaying.props) {
            const nowPlayingButton = <HTMLImageElement>(
                document.querySelector(
                    `.track-play[data-id="${this.nowPlaying.props.id}"]`
                )
            );
            if (nowPlayingButton) {
                nowPlayingButton.src = '/static/img/play-outline.svg';
            }
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
            artist: new ArtistModel(),
            track: '',
            track_id: 0,
            track_in_favorites: false,
            left_disabled: true,
            right_disabled: true,
            file: '',
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

    setPos(pos: number, track?: TrackModel) {
        this.pos = pos;
        if (track) {
            this.nowPlaying = track;
        } else {
            this.nowPlaying = this.playlist[pos];
        }
    }
}

export default new PlayerComponent();
