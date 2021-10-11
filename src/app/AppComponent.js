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
    this.playButtonHandler = (e) => {
      if (e.target.className === 'track-list-item-play') {
        e.stopPropagation();
        e.preventDefault();
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
  }

  didMount() {
    Request.get(
      '/auth',
    )
      .then(({ status }) => { this.authenticated = status === 200; });

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
        topbar: new TopBar({ authenticated: this.authenticated }),
        friend_activity: new FriendActivity(),
        player: new PlayerComponent(),
      };

      Object.values(this.data).forEach((component) => { component.render(); });

      this.data.top_albums.render();
      this.data.suggested_artists.render();
      this.data.track_list.render();
      this.isLoaded = true;
      this.template = Handlebars.templates['app.hbs'](this.data);
      this.render();
      document.addEventListener('click', this.authHandler);
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
