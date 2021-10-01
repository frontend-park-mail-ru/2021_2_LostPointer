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
<!--                    {{#render suggested_playlists}}{{/render}}-->
                    {{#render track_list}}{{/render}}
                    {{#render suggested_artists}}{{/render}}
                </div>
            </div>
<!--            {{#render friend_activity}}{{/render}}-->
        </div>
    </div>
</div>
{{#render player}}{{/render}}
  `;
    this.data = {
      sidebar: new AppSidebar(),
      topbar: new AppTopbar(),
      top_albums: new AppTopAlbums(),
      suggested_playlists: new AppSuggestedPlaylists(),
      track_list: new AppTrackList(),
      suggested_artists: new AppSuggestedArtists(),
      friend_activity: new AppFriendActivity(),
      player: new AppPlayer(),
    };
  }

  render() {
    super.render();
    Request.get(
      '/auth',
    )
      .then(({ status }) => {
        if (status !== 200) {
          const button = document.querySelector('.topbar-profile');
          button.setAttribute('href', '/signin');
          button.src = '/src/static/img/enter.png';
        } else {
          const button = document.querySelector('.topbar-profile');
          button.setAttribute('href', '/user/logout');
          button.src = '/src/static/img/ava.png';
        }
      })
      .catch((error) => console.error(error.msg));
  }
}
