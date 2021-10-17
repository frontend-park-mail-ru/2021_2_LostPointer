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
        }),
        friend_activity: new FriendActivity(),
        player: new PlayerComponent(),
      };

      Object.values(this.data).forEach((component) => { component.render(); });

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

      if (this.authenticated) {
        Request.get('/user/settings')
          .then((settingsResponse) => {
            this.data.topbar.data.avatar = settingsResponse.body.avatar_small;
            this.data.topbar.update();
          });
      }
    })
      .catch((error) => console.log(error.msg));
  }

  render() {
    if (!this.isLoaded) {
      this.didMount();
    } else {
      super.render();
    }
  }
}
