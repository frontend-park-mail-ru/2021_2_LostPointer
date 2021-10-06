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
// eslint-disable-next-line import/no-cycle
import { navigateTo } from '../framework/core/router.js';

export class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.isLoaded = false;
  }

  didMount() {
    Request.get('/home').then((response) => {
      const albums = response.body.albums.map((e) => ({ img: e.artWork }));

      this.data.top_albums = new TopAlbums({ albums });
      this.data.suggested_artists = new SuggestedArtists({ artists: albums });
      this.data.track_list = new TrackList({ tracks: response.body.tracks });
      this.data.suggested_playlists = new SuggestedPlaylists({
        playlists: [
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
        ],
      });

      this.data.sidebar = new Sidebar();
      this.data.topbar = new TopBar();
      this.data.friend_activity = new FriendActivity();
      this.data.player = new PlayerComponent();

      this.data.sidebar.render();
      this.data.topbar.render();
      this.data.friend_activity.render();
      this.data.player.render();

      this.data.top_albums.render();
      this.data.suggested_artists.render();
      this.data.track_list.render();
      this.isLoaded = true;
      this.template = Handlebars.templates['app.hbs'](this.data);
      this.render();
    });

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
  }

  sendLogout() {
    Request.post('/user/logout')
      .then(({ status }) => {
        if (status === 200) {
          navigateTo('/signin');
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
