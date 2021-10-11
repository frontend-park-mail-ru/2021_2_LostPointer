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
  }

  didMount() {
    Request.get(
      '/auth',
    )
      .then(({ status }) => { this.authenticated = status === 200; })
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
      const that = this;
      document.addEventListener('click', (e) => {
        if (e.target.className === 'topbar-auth' && e.target.dataset.action === 'logout') {
          logout().then(() => {
            that.data.topbar.data.authenticated = false;
            that.data.topbar.update();
          });
        }
      });
    })
      .catch((error) => console.log(error.msg));
  }

  render() {
    if (!this.isLoaded) {
      this.didMount();
    } else {
      super.render();
    }

    if (this.data.player) {
      this.data.player.setup();
    }

    Request.get(
      '/auth',
    )
      .then(({ status }) => {
        if (status !== 200) {
          const button = document.querySelector('.topbar-auth');
          button.removeEventListener('click', this.sendLogout);
          button.setAttribute('data-link', '');
          button.setAttribute('href', '/signin');
          button.src = '/src/static/img/login.png';

          document.querySelector('.topbar-profile').classList.add('invisible');
        } else {
          const button = document.querySelector('.topbar-auth');
          button.addEventListener('click', this.sendLogout);
          button.removeAttribute('data-link');
          button.removeAttribute('href');
          button.src = '/src/static/img/logout.png';

          document.querySelector('.topbar-profile').classList.remove('invisible');
        }
      })
      .catch((error) => console.error(error.msg));
    document.addEventListener('click', (e) => {
      if (e.target.className === 'track-list-item-play') {
        e.stopPropagation();
        e.preventDefault();
        this.data.player.setTrack({
          url: `https://lostpointer.site/src/static/tracks/${e.target.dataset.url}`,
          cover: `/src/static/img/artworks/${e.target.dataset.cover}.webp`,
          title: e.target.dataset.title,
          artist: e.target.dataset.artist,
        });
      }
    });
  }
}
