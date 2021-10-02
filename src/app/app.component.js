import { Component } from '../framework/core/component.js';
import { AppSidebar } from './app.common/app.sidebar.js';
import { AppPlayer } from './app.common/app.player.js';
import { AppTopbar } from './app.common/app.topbar.js';
import { AppTopAlbums } from './app.common/app.topalbums.js';
import { AppSuggestedPlaylists } from './app.common/app.suggestedplaylists.js';
import { AppTrackList } from './app.common/app.tracklist.js';
import { AppSuggestedArtists } from './app.common/app.suggestedartists.js';
import { AppFriendActivity } from './app.common/app.friendactivity.js';
import Request from '../framework/appApi/request.js';
// eslint-disable-next-line import/no-cycle
import { navigateTo } from '../framework/core/router.js';

export class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.template = `
        <div class="app__content">
            {{#render sidebar}}{{/render}}
            <div class="main-layout">
                {{#render topbar}}{{/render}}
                <div class="main-layout__content">
                    <div class="listen-now">
                        {{#render top_albums}}{{/render}}
                        <div class="listen-now__suggested-content">
                            {{#render suggested_playlists}}{{/render}}
                            {{#render track_list}}{{/render}}
                            {{#render suggested_artists}}{{/render}}
                        </div>
                    </div>
                    {{#render friend_activity}}{{/render}}
                </div>
            </div>
        </div>
        {{#render player}}{{/render}}
    `;
    this.data = {
      sidebar: new AppSidebar(),
      topbar: new AppTopbar(),
      suggested_playlists: new AppSuggestedPlaylists(),
      track_list: new AppTrackList(),
      friend_activity: new AppFriendActivity(),
      player: new AppPlayer(),
    };
  }

  didMount() {
    Request.get('/home').then((response) => {
      const albums = response.body.albums.map((e) => ({ img: e.artWork }));

      this.data.top_albums = new AppTopAlbums({ albums });
      this.data.suggested_artists = new AppSuggestedArtists({ artists: albums });
      this.data.top_albums.render();
      this.data.suggested_artists.render();
      this.isLoaded = true;
      this.render();
    });
  }

  sendLogout() {
    Request.post('/user/logout')
      .then(({ status }) => {
        console.log(status);
        if (status === 200) {
          navigateTo('/signin');
          console.log('navigating');
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
}
