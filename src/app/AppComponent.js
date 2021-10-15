import { Component } from '../framework/core/component.js';
import { Sidebar } from './common/Sidebar.js';
import { PlayerComponent } from './common/PlayerComponent.js';
import { TopBar } from './common/TopBar.js';
import { TopAlbums } from './common/TopAlbums.js';
import { SuggestedPlaylists } from './common/SuggestedPlaylists.js';
import { TrackList } from './common/TrackList.js';
import { SuggestedArtists } from './common/SuggestedArtists.js';
import { FriendActivity } from './common/FriendActivity.js';
import Request from '../framework/appApi/request.js';
import { logout } from './common/utils.js';

export class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.isLoaded = false;
    this.authHandler = (e) => {
      if (e.target.className === 'topbar-auth' && e.target.dataset.action === 'logout') {
        logout().then(() => {
          this.data.topbar.data.authenticated = false;
          this.data.topbar.update();
        });
      }
    };
  }

  didMount() {
    Request.get(
      '/auth',
    )
      .then(({ status }) => {
        this.authenticated = status === 200;
      })
      .catch((error) => console.log(error.msg));

    Request.get('/home').then((response) => {
      const albums = response.body.albums.map((e) => ({ img: e.artWork }));
      const predefinedPlaylists = [
        {
          cover: 'yur.jpg',
          title: 'Jail Mix',
        },
        {
          cover: 'albina.jpeg',
          title: 'Resine Working Mix Extended',
        },
        {
          cover: 'starboy.jpg',
          title: 'Workout Mix 2',
        },
      ];

      this.data = {
        top_albums: new TopAlbums({ albums }),
        suggested_artists: new SuggestedArtists({ artists: response.body.artists }),
        track_list: new TrackList({ tracks: response.body.tracks }),
        suggested_playlists: new SuggestedPlaylists({ playlists: predefinedPlaylists }),
        sidebar: new Sidebar(),
        topbar: new TopBar({
          authenticated: this.authenticated,
          avatar: this.userAvatar,
        }),
        friend_activity: new FriendActivity(),
        player: new PlayerComponent(),
      };

      Object.values(this.data).forEach((component) => { component.render(); });

      this.data.top_albums.render();
      this.data.suggested_artists.render();
      this.data.track_list.render();
      this.isLoaded = true;
      this.template = Handlebars.templates['app.hbs'](this.data);

      document.addEventListener('click', this.authHandler);

      this.syncPlayButtonsHandler = (target, event) => {
        const play = event.type === 'play';
        // eslint-disable-next-line no-param-reassign
        target.src = `/src/static/img/${play ? 'pause' : 'play'}-outline.svg`;
      };
      this.playButtonHandler = (e) => {
        if (e.target.className === 'track-list-item-play') {
          if (e.target === this.nowPlaying) { // Ставим на паузу/продолжаем воспр.
            console.log(e.target);
            this.data.player.toggle();
            return;
          }
          if (this.nowPlaying) { // Переключили на другой трек
            console.log('remove');
            // Не работает (как обычно)
            this.data.player.player.removeEventListener('play', this.currentHandler);
            this.data.player.player.removeEventListener('pause', this.currentHandler);

            this.nowPlaying.src = '/src/static/img/play-outline.svg';
          }

          this.nowPlaying = e.target; // Включили трек из списка
          this.currentHandler = this.syncPlayButtonsHandler.bind(null, this.nowPlaying);
          this.data.player.player.addEventListener('play', this.currentHandler);
          this.data.player.player.addEventListener('pause', this.currentHandler);

          e.target.src = '/src/static/img/pause-outline.svg';
          if (e.target.dataset.playing === 'true') {
            e.target.dataset.playing = 'false';
            this.data.player.toggle();
            return;
          }
          e.target.dataset.playing = 'true';
          this.data.player.setTrack({
            url: `https://lostpointer.site/src/static/tracks/${e.target.dataset.url}`,
            cover: `/src/static/img/artworks/${e.target.dataset.cover}.webp`,
            title: e.target.dataset.title,
            artist: e.target.dataset.artist,
          });
        }
      };
      this.render();

      if (this.authenticated) {
        Request.get('/user/settings')
          .then((settingsResponse) => {
            this.data.topbar.data.avatar = settingsResponse.body.avatar;
            this.data.topbar.update();
          });
      }
    });
  }

  unmount() {
    document.removeEventListener('click', this.authHandler);
    document.removeEventListener('click', this.playButtonHandler);
  }

  render() {
    if (!this.isLoaded) {
      this.didMount();
    } else {
      super.render();
    }

    if (this.data && this.data.player) {
      this.data.player.unmount();
      this.data.player.setup();
    }
    document.addEventListener('click', this.playButtonHandler);
  }
}
